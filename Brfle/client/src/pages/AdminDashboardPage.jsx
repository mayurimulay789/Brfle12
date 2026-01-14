"use client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Download, 
  IndianRupee,
  BarChart3,
  Clock,
  CheckCircle,
  Activity,
  ArrowUp,
  ArrowDown,
  Eye,
  DollarSign,
  UserPlus,
  BookCheck,
  Calendar,
  Target,
  Award,
  Zap
} from "lucide-react"
import AdminUserTable from "../Components/AdminUserTable"
import AdminCourseForm from "../Components/AdminCourseForm"
import AdminReportsChart from "../Components/AdminReportsChart"
import {
  fetchDashboardStats,
  fetchRevenueAnalytics,
  fetchCourseAnalytics,
  fetchUserAnalytics,
  fetchRecentActivities,
  clearError,
  clearDashboardData
} from "../../src/store/slices/adminSlice"

const AdminDashboardPage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { 
    dashboardStats,
    dashboardLoading,
    dashboardError
  } = useSelector((state) => state.admin)

  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("month")

  useEffect(() => {
    if (activeTab === "overview") {
      loadDashboardData()
    }
  }, [activeTab, timeRange])

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      dispatch(clearDashboardData())
    }
  }, [dispatch])

  const loadDashboardData = () => {
    dispatch(clearError())
    dispatch(fetchDashboardStats())
    dispatch(fetchRevenueAnalytics({ period: timeRange }))
    dispatch(fetchCourseAnalytics())
    dispatch(fetchUserAnalytics())
    dispatch(fetchRecentActivities({ limit: 5 }))
  }

  // Format dashboard stats from Redux state
  const formatStats = () => {
    if (!dashboardStats) return null

    const stats = dashboardStats.stats || dashboardStats
    
    return {
      totalUsers: stats.users?.total || 0,
      totalCourses: stats.courses?.total || 0,
      totalRevenue: stats.revenue?.total || 0,
      activeEnrollments: stats.enrollments?.active || 0,
      completionRate: Math.round(stats.enrollments?.completionRate || 0),
      newUsers: stats.users?.new || 0,
      totalEnrollments: stats.enrollments?.total || 0,
      successRate: stats.revenue?.successRate || 0
    }
  }

  const stats = formatStats() || {
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeEnrollments: 0,
    completionRate: 0,
    newUsers: 0,
    totalEnrollments: 0,
    successRate: 0
  }

  // Main stat cards
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-blue-500",
      change: dashboardStats?.users?.growth || "+0%",
      trend: "up",
      description: "Registered users",
      loading: dashboardLoading
    },
    {
      title: "Total Courses",
      value: stats.totalCourses.toString(),
      icon: BookOpen,
      color: "bg-green-500",
      change: dashboardStats?.courses?.growth || "+0%",
      trend: "up",
      description: "Published courses",
      loading: dashboardLoading
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: "bg-purple-500",
      change: dashboardStats?.revenue?.growth || "+0%",
      trend: "up",
      description: "Total earnings",
      loading: dashboardLoading
    },
    {
      title: "Active Enrollments",
      value: stats.activeEnrollments.toLocaleString(),
      icon: TrendingUp,
      color: "bg-orange-500",
      change: dashboardStats?.enrollments?.growth || "+0%",
      trend: "up",
      description: "Current enrollments",
      loading: dashboardLoading
    }
  ]

  // Performance metrics
  const performanceCards = [
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: CheckCircle,
      color: "bg-emerald-500",
      change: "+5.2%",
      trend: "up",
      description: "Course completion rate",
      loading: dashboardLoading
    },
    {
      title: "New Users",
      value: stats.newUsers.toString(),
      icon: UserPlus,
      color: "bg-indigo-500",
      change: "+12.8%",
      trend: "up",
      description: "This month",
      loading: dashboardLoading
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      icon: Target,
      color: "bg-amber-500",
      change: "+3.4%",
      trend: "up",
      description: "Payment success rate",
      loading: dashboardLoading
    },
    {
      title: "Total Enrollments",
      value: stats.totalEnrollments.toLocaleString(),
      icon: Award,
      color: "bg-rose-500",
      change: "+8.7%",
      trend: "up",
      description: "All time enrollments",
      loading: dashboardLoading
    }
  ]


  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "courses", label: "Courses" },
  ]



  const isLoading = dashboardLoading && !dashboardStats

  const handleRetry = () => {
    loadDashboardData()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">Welcome back, {user?.name || 'Admin'}! 👋</p>
              </div>
            </div>
           
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-blue-50/50 -mx-3 px-3 rounded-t-lg"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Error Display */}
      {dashboardError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-red-800 text-sm">{dashboardError}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handleRetry}
                  className="text-red-800 hover:text-red-900 text-sm font-medium"
                >
                  Retry
                </button>
                <button 
                  onClick={() => dispatch(clearError())}
                  className="text-red-800 hover:text-red-900"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 md:gap-5">
              {statCards.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 md:gap-5">
              {performanceCards.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "users" && <AdminUserTable />}
        {activeTab === "courses" && <AdminCourseForm />}
      </div>
    </div>
  )
}

// Stat Card Component

const StatCard = ({ stat }) => {
  return (
    <div
      className="
        bg-white border border-gray-100 rounded-2xl
        p-4 sm:p-4 lg:p-4
        shadow-sm hover:shadow-lg
        transition-all duration-300
        hover:-translate-y-1
        group
        w-full
      "
    >
      {stat.loading ? (
        /* -------------------- Skeleton Loader -------------------- */
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gray-200" />
            <div className="h-4 w-14 rounded bg-gray-200" />
          </div>

          <div className="space-y-2">
            <div className="h-7 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="h-3 w-2/3 bg-gray-200 rounded" />
          </div>
        </div>
      ) : (
        /* -------------------- Content -------------------- */
        <div className="flex flex-col  h-full">
          {/* Top Row */}
          <div className="flex items-start justify-between mb-2 ">
            {/* Icon */}
            <div
              className={`
                w-11 h-11 sm:w-10 sm:h-10
                rounded-xl ${stat.color}
                flex items-center justify-center
                group-hover:scale-110
                transition-transform duration-200
              `}
            >
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>

            {/* Trend */}
            {stat.trend && (
              <div
                className={`
                  flex items-center gap-1 text-xs sm:text-sm font-medium
                  ${
                    stat.trend === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                `}
              >
                {stat.trend === "up" ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                <span>{stat.change}</span>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="mt-auto flex justify-between">
          <p className="text-sm sm:text-base font-medium text-gray-800 mt-1">
              {stat.title}
              
            </p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {stat.value}
            </p>

            
          </div>
        </div>
      )}
    </div>
  );
};



export default AdminDashboardPage
