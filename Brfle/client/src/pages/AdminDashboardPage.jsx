// "use client"

// import { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { Users, BookOpen, TrendingUp, Download, } from "lucide-react"
// import AdminUserTable from "../Components/AdminUserTable"
// import AdminCourseForm from "../Components/AdminCourseForm"
// // import AdminContactMessages from "../Components/AdminContactMessages"


// import { IndianRupee } from "lucide-react"

// // Custom Indian Rupee Icon component
// const IndianRupeeIcon = (props) => (
//   <IndianRupee {...props} />
// )

// const AdminDashboardPage = () => {
//   const dispatch = useDispatch()
//   const { user } = useSelector((state) => state.auth)
//   const [activeTab, setActiveTab] = useState("overview")
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalCourses: 0,
//     totalRevenue: 0,
//     activeEnrollments: 0,
//   })
//   const [isLoading, setIsLoading] = useState(true)

 

 
//   const tabs = [
//     { id: "overview", label: "Overview" },
//     { id: "users", label: "Users" },
//     { id: "courses", label: "Courses" },
//   ]

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//               <p className="text-gray-600">Manage your LMS platform</p>
//             </div>
//             <div className="flex space-x-4">
//               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
//                 <Download className="h-4 w-4" />
//                 <span>Export Data</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <nav className="flex space-x-8">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === tab.id
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {activeTab === "overview" && (
//           <div className="space-y-8">
           

            
//           </div>
//         )}

//         {activeTab === "users" && <AdminUserTable />}
//         {activeTab === "courses" && <AdminCourseForm />}       
//       </div>
//     </div>
//   )
// }

// export default AdminDashboardPage

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
    revenueAnalytics,
    courseAnalytics,
    userAnalytics,
    recentActivities,
    dashboardLoading,
    revenueLoading,
    courseAnalyticsLoading,
    userAnalyticsLoading,
    recentActivitiesLoading,
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

  // Quick stats for header
  const quickStats = [
    {
      title: "Daily Visits",
      value: userAnalytics?.dailyVisits?.toLocaleString() || "1,245",
      change: userAnalytics?.dailyGrowth || "+12.3%",
      trend: "up",
      icon: Eye
    },
    {
      title: "Revenue Today",
      value: `₹${revenueAnalytics?.todayRevenue?.toLocaleString() || "12,456"}`,
      change: revenueAnalytics?.dailyGrowth || "+8.4%",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Course Completions",
      value: courseAnalytics?.dailyCompletions?.toString() || "89",
      change: courseAnalytics?.completionGrowth || "+15.7%",
      trend: "up",
      icon: BookCheck
    }
  ]

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "courses", label: "Courses" },
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'enrollment':
        return <UserPlus className="h-4 w-4 text-blue-500" />
      case 'completion':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'purchase':
        return <DollarSign className="h-4 w-4 text-purple-500" />
      case 'rating':
        return <BarChart3 className="h-4 w-4 text-amber-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'enrollment':
        return 'bg-blue-50 border-blue-200'
      case 'completion':
        return 'bg-green-50 border-green-200'
      case 'purchase':
        return 'bg-purple-50 border-purple-200'
      case 'rating':
        return 'bg-amber-50 border-amber-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">Welcome back, {user?.name || 'Admin'}! 👋</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={dashboardLoading}
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 3 months</option>
                <option value="year">Last year</option>
              </select>
              <button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={dashboardLoading}
              >
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
const StatCard = ({ stat }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
    {stat.loading ? (
      <div className="animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    ) : (
      <>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
            <stat.icon className="h-6 w-6 text-white" />
          </div>
          <div className={`flex items-center space-x-1 text-sm ${
            stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {stat.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            <span>{stat.change}</span>
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
          <p className="text-sm font-medium text-gray-900">{stat.title}</p>
          <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
        </div>
      </>
    )}
  </div>
)

export default AdminDashboardPage
