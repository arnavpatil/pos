"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import TenantList from "@/components/TenantList";
import TenantForm from "@/components/TenantForm";
import LeaseManagement from "@/components/LeaseManagement";
import RentCollection from "@/components/RentCollection";
import NotificationManager from "@/components/NotificationManager";
import { Tenant, TenantFormData, RentPayment } from "@/types/tenant";
import { getRolePermissions } from "@/data/mockAuth";
import { tenantService } from "@/services/tenantService";

type TabType = "list" | "lease" | "rent" | "notifications";

interface ApiTenant {
  id: string;
  userId: string;
  businessName: string;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  rentals: Array<{
    id: string;
    tenantId: string;
    cubeId: string;
    startDate: string;
    endDate: string;
    status: string;
    monthlyRent: number;
    lastPayment: string | null;
    createdAt: string;
    updatedAt: string;
    allocatedById: string;
    cube?: {
      id: string;
      code: string;
      size: string;
      pricePerMonth: number;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
  }>;
}

export default function TenantsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("list");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch tenants from API
  const fetchTenants = async () => {
    try {
      console.log("Fetching tenants using tenantService...");
      
      const apiTenants: ApiTenant[] = await tenantService.viewAllTenants();
      console.log("API Response:", apiTenants);
      
      // Convert API tenants to the format expected by the UI
      const convertedTenants: Tenant[] = apiTenants.map((apiTenant) => {
        // Handle multiple rentals - get the most recent active one or the first one
        const activeRental = apiTenant.rentals.find(rental => rental.status === "ACTIVE") || apiTenant.rentals[0];
        
        let status: "Upcoming" | "Active" | "Expired" = "Expired";
        
        if (activeRental) {
          const now = new Date();
          const startDate = new Date(activeRental.startDate);
          const endDate = new Date(activeRental.endDate);
          
          if (activeRental.status === "ACTIVE" && now >= startDate && now <= endDate) {
            status = "Active";
          } else if (now < startDate) {
            status = "Upcoming";
          } else {
            status = "Expired";
          }
        }

        const convertedTenant = {
          id: apiTenant.id,
          name: apiTenant.user.name,
          email: apiTenant.user.email,
          phone: apiTenant.user.phone,
          businessName: apiTenant.businessName,
          cubeId: activeRental?.cube?.code || "No Cube",
          leaseStartDate: activeRental?.startDate || "",
          leaseEndDate: activeRental?.endDate || "",
          monthlyRent: activeRental?.monthlyRent || 0,
          securityDeposit: 0, // Not in API
          status,
          rentPayments: [], // Not in current API structure
          address: apiTenant.address,
          notes: apiTenant.notes || "",
        };
        
        console.log("Converted tenant:", convertedTenant);
        return convertedTenant;
      });
      
      console.log("All converted tenants:", convertedTenants);
      setTenants(convertedTenants);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (user && !getRolePermissions(user.role).includes("tenants")) {
      router.push("/");
      return;
    }

    if (isAuthenticated && user) {
      fetchTenants();
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (
    !isAuthenticated ||
    !user ||
    !getRolePermissions(user.role).includes("tenants")
  ) {
    return null; // Will redirect
  }

  const handleAddTenant = () => {
    setEditingTenant(null);
    setIsFormOpen(true);
  };

  const handleViewTenant = (tenantId: string) => {
    router.push(`/admin/tenants/${tenantId}`);
  };

  const handleSubmitTenant = async (tenant: Tenant) => {
    if (editingTenant) {
      // Update existing tenant - would need API endpoint for updates
      setTenants((prev) => prev.map((t) => (t.id === tenant.id ? tenant : t)));
    } else {
      // Add new tenant - TenantForm already handles the API call
      // Just add the tenant to the local state and refresh the list
      setTenants((prev) => [...prev, tenant]);
      setIsFormOpen(false);

      // Optionally refresh the tenant list to get the latest data from server
      setTimeout(() => {
        fetchTenants();
      }, 1000);
    }
  };

  const handleUpdateLease = (
    tenantId: string,
    startDate: string,
    endDate: string
  ) => {
    // Calculate status based on dates
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    let status: "Upcoming" | "Active" | "Expired" = "Expired";

    if (now < start) {
      status = "Upcoming";
    } else if (now >= start && now <= end) {
      status = "Active";
    } else {
      status = "Expired";
    }

    setTenants((prev) =>
      prev.map((tenant) => {
        if (tenant.id === tenantId) {
          return {
            ...tenant,
            leaseStartDate: startDate,
            leaseEndDate: endDate,
            status,
          };
        }
        return tenant;
      })
    );
  };

  const handleAddPayment = (
    tenantId: string,
    payment: Omit<RentPayment, "id" | "tenantId">
  ) => {
    const newPayment: RentPayment = {
      ...payment,
      id: `payment-${Date.now()}`,
      tenantId,
    };

    setTenants((prev) =>
      prev.map((tenant) => {
        if (tenant.id === tenantId) {
          return {
            ...tenant,
            rentPayments: [...tenant.rentPayments, newPayment],
          };
        }
        return tenant;
      })
    );
  };

  const downloadPaymentHistory = (tenantId?: string) => {
    let paymentsToExport: (RentPayment & { tenantName: string })[] = [];

    if (tenantId) {
      // Download for specific tenant
      const tenant = tenants.find((t) => t.id === tenantId);
      if (tenant) {
        paymentsToExport = tenant.rentPayments.map((payment) => ({
          ...payment,
          tenantName: tenant.name,
        }));
      }
    } else {
      // Download for all tenants
      paymentsToExport = tenants.flatMap((tenant) =>
        tenant.rentPayments.map((payment) => ({
          ...payment,
          tenantName: tenant.name,
        }))
      );
    }

    // Create CSV content
    const headers = [
      "Date",
      "Tenant Name",
      "Amount",
      "Payment Method",
      "Payment ID",
    ];
    const csvContent = [
      headers.join(","),
      ...paymentsToExport.map((payment) =>
        [
          new Date(payment.date).toLocaleDateString(),
          payment.tenantName,
          `$${payment.amount}`,
          payment.method,
          payment.id,
        ].join(",")
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `payment-history-${tenantId || "all"}-${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { id: "list" as TabType, name: "Tenant List", icon: "👥" },
    { id: "lease" as TabType, name: "Lease Management", icon: "📋" },
    { id: "rent" as TabType, name: "Rent Collection", icon: "💰" },
    { id: "notifications" as TabType, name: "Notifications", icon: "🔔" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Tenant & Rental Management
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage tenants, leases, and rent collection for Cornven cube spaces
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-1 sm:mr-2">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.name.split(" ")[0]}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "list" && (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tenant Management
                </h2>
                <button
                  onClick={() => downloadPaymentHistory()}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Download All Payment History</span>
                </button>
              </div>
              <TenantList
                tenants={tenants}
                onViewTenant={handleViewTenant}
                onAddNew={handleAddTenant}
              />
            </>
          )}

          {activeTab === "lease" && (
            <LeaseManagement
              tenants={tenants}
              onUpdateLease={handleUpdateLease}
            />
          )}

          {activeTab === "rent" && (
            <RentCollection tenants={tenants} onAddPayment={handleAddPayment} />
          )}

          {activeTab === "notifications" && (
            <NotificationManager tenants={tenants} />
          )}
        </div>

        {/* Statistics Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-primary-600">
              {tenants.length}
            </div>
            <div className="text-sm text-gray-600">Total Tenants</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {tenants.filter((t) => t.status === "Active").length}
            </div>
            <div className="text-sm text-gray-600">Active Leases</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {tenants.filter((t) => t.status === "Upcoming").length}
            </div>
            <div className="text-sm text-gray-600">Upcoming Leases</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {tenants.filter((t) => t.status === "Expired").length}
            </div>
            <div className="text-sm text-gray-600">Expired Leases</div>
          </div>
        </div>
      </div>

      {/* Tenant Form Modal */}
      <TenantForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitTenant}
        editingTenant={editingTenant}
      />
    </div>
  );
}
