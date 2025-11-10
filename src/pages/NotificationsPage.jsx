import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import TopNavigation from '@/components/layout/TopNavigation'
import FooterSection from '@/components/sections/FooterSection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  CheckCircle2, 
  Calendar, 
  XCircle, 
  FileText, 
  Clock, 
  ArrowLeft,
  Trash2,
  CheckCheck
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/contexts/ToastContext'
import { apiClient } from '@/lib/api'

/**
 * NotificationsPage
 * -----------------
 * Fetches notifications for the logged-in user with pagination, unread counts,
 * filtering, and inline actions (mark read/delete). Mirrors behaviour of a typical inbox.
 */
const NotificationsPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  // Selected filter tab
  const [filter, setFilter] = useState('all')

  // Infinite scroll style pagination meta
  const [notifications, setNotifications] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isUnreadLoading, setIsUnreadLoading] = useState(false)

  // Lightweight endpoint to update the unread badge.
  const fetchUnreadCount = useCallback(async () => {
    if (!user?._id) return
    try {
      setIsUnreadLoading(true)
      const response = await apiClient.get('/notifications/unread-count', { userId: user._id })
      setUnreadCount(response?.count ?? 0)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    } finally {
      setIsUnreadLoading(false)
    }
  }, [user?._id])

  // Shared fetcher used by initial load and "load more" button.
  const fetchNotifications = useCallback(
    async (pageToLoad = 1, append = false) => {
      if (!user?._id) return
      const params = {
        userId: user._id,
        page: pageToLoad,
        limit: 12,
      }

      try {
        if (append) {
          setIsLoadingMore(true)
        } else {
          setIsInitialLoading(true)
        }

        const response = await apiClient.get('/notifications', params)
        const items = response?.data ?? []
        setNotifications((prev) => (append ? [...prev, ...items] : items))
        setHasMore(response?.pagination?.hasMore ?? false)
        setPage(pageToLoad)
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
        toast.error('Failed to load notifications', error.message || 'Please try again later.')
        if (!append) {
          setNotifications([])
        }
      } finally {
        if (append) {
          setIsLoadingMore(false)
        } else {
          setIsInitialLoading(false)
        }
      }
    },
    [toast, user?._id]
  )

  // Kick off queries whenever the user context changes.
  useEffect(() => {
    if (user?._id) {
      fetchNotifications(1, false)
      fetchUnreadCount()
    } else {
      setNotifications([])
      setUnreadCount(0)
    }
  }, [fetchNotifications, fetchUnreadCount, user?._id])

  const handleLoadMoreNotifications = () => {
    if (!hasMore || isLoadingMore) return
    fetchNotifications(page + 1, true)
  }

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) =>
    filter === 'all' ? true : !notif.read
  )

  const handleMarkAsRead = async (notificationId) => {
    try {
      await apiClient.post(`/notifications/${notificationId}/read`)
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true, readAt: Date.now() } : notif
        )
      )
      setUnreadCount((prev) => Math.max(prev - 1, 0))
      toast.success('Notification marked as read')
    } catch (error) {
      toast.error('Failed to mark notification as read', error.message)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user?._id) return
    try {
      await apiClient.post('/notifications/mark-all-read', { userId: user._id })
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true, readAt: Date.now() })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark all as read', error.message)
    }
  }

  const handleDelete = async (notificationId) => {
    try {
      await apiClient.delete(`/notifications/${notificationId}`)
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId))
      const removedNotification = notifications.find((notif) => notif._id === notificationId)
      if (removedNotification && !removedNotification.read) {
        setUnreadCount((prev) => Math.max(prev - 1, 0))
      }
      toast.success('Notification deleted')
    } catch (error) {
      toast.error('Failed to delete notification', error.message)
    }
  }

  const handleNotificationClick = (notification) => {
    // Mark as read if unread
    if (!notification.read) {
      handleMarkAsRead(notification._id)
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
    }
  }

  // Map backend notification types to icons.
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment_created':
      case 'appointment_confirmed':
      case 'appointment_completed':
        return <Calendar className="h-5 w-5 text-[#10B981]" />
      case 'appointment_cancelled':
        return <XCircle className="h-5 w-5 text-[#EF4444]" />
      case 'appointment_reminder':
        return <Clock className="h-5 w-5 text-[#F59E0B]" />
      case 'prescription_added':
      case 'medical_record_added':
        return <FileText className="h-5 w-5 text-[#3B82F6]" />
      default:
        return <Bell className="h-5 w-5 text-[#2AA8FF]" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'appointment_created':
      case 'appointment_confirmed':
      case 'appointment_completed':
        return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
      case 'appointment_cancelled':
        return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
      case 'appointment_reminder':
        return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
      case 'prescription_added':
      case 'medical_record_added':
        return 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20'
      default:
        return 'bg-[#2AA8FF]/10 text-[#2AA8FF] border-[#2AA8FF]/20'
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E7F0FF] via-white to-white">
      <TopNavigation />
      <main className="mx-auto max-w-4xl px-4 py-8 pt-32">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4 border-[#DCE6F5] bg-white text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#102851]">Notifications</h1>
              <p className="text-[#5C6169] mt-2">
                {isUnreadLoading
                  ? 'Checking notifications...'
                  : unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                  : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                className="border-[#DCE6F5] bg-white text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* --- Filter Tabs --- */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={
              filter === 'all'
                ? 'bg-[#2AA8FF] text-white hover:bg-[#1896f0]'
                : 'border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]'
            }
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            onClick={() => setFilter('unread')}
            className={
              filter === 'unread'
                ? 'bg-[#2AA8FF] text-white hover:bg-[#1896f0]'
                : 'border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]'
            }
          >
            Unread
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-[#EF4444] text-white">{unreadCount}</Badge>
            )}
          </Button>
        </div>

        {/* --- Notifications List --- */}
        {isInitialLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Card
                key={idx}
                className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)] p-4 animate-pulse"
              >
                <CardContent className="flex items-start gap-4 p-0">
                  <div className="h-10 w-10 rounded-full bg-[#E7F0FF]" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-40 rounded bg-[#E7F0FF]" />
                    <div className="h-3 w-full rounded bg-[#F0F4FF]" />
                    <div className="h-3 w-24 rounded bg-[#F0F4FF]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
            <CardContent className="py-12 text-center">
              <Bell className="mx-auto h-16 w-16 text-[#ABB6C7]" />
              <p className="mt-4 text-lg font-medium text-[#102851]">No notifications</p>
              <p className="mt-2 text-sm text-[#5C6169]">
                {filter === 'unread' 
                  ? 'You have no unread notifications'
                  : 'You\'re all caught up! No notifications yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification._id}
                className={`border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)] transition hover:shadow-md cursor-pointer ${
                  !notification.read ? 'border-l-4 border-l-[#2AA8FF]' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold text-sm ${!notification.read ? 'text-[#102851]' : 'text-[#5C6169]'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-[#2AA8FF]"></div>
                            )}
                          </div>
                          <p className="text-sm text-[#5C6169] mb-2">{notification.message}</p>
                          <p className="text-xs text-[#9CA3AF]">{formatTime(notification.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notification._id)
                              }}
                              className="h-8 w-8 p-0 text-[#5C6169] hover:text-[#102851]"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(notification._id)
                            }}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(hasMore || isLoadingMore) && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={handleLoadMoreNotifications}
                  disabled={isLoadingMore || !hasMore}
                  className="border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
                >
                  {isLoadingMore ? 'Loading…' : hasMore ? 'Load more notifications' : 'No more notifications'}
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
      <FooterSection />
    </div>
  )
}

export default NotificationsPage

