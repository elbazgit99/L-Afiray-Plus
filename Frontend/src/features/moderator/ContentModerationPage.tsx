import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { toast } from 'sonner';
import { 
  Flag, 
  Eye, 
  EyeOff, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Filter,
  Search,
  Clock,
  User,
  Package,
  Shield,
  Ban,
  Check,
  X,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';

interface ReportedContent {
  _id: string;
  contentType: 'part' | 'review' | 'user' | 'message';
  contentId: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  action?: string;
  notes?: string;
}

interface Dispute {
  _id: string;
  type: 'refund' | 'quality' | 'delivery' | 'communication' | 'other';
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  orderId: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

const ContentModerationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reports' | 'disputes' | 'audit'>('reports');
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportedContent | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for demonstration
  const sampleReports: ReportedContent[] = [
    {
      _id: '1',
      contentType: 'part',
      contentId: 'part123',
      reporterId: 'user1',
      reporterName: 'John Doe',
      reason: 'Inappropriate content',
      description: 'This part listing contains offensive language in the description',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      contentType: 'review',
      contentId: 'review456',
      reporterId: 'user2',
      reporterName: 'Jane Smith',
      reason: 'Spam',
      description: 'This review appears to be fake and promotional',
      status: 'reviewed',
      priority: 'medium',
      createdAt: '2024-01-14T15:45:00Z',
      reviewedAt: '2024-01-15T09:20:00Z',
      reviewedBy: 'moderator1',
      action: 'removed',
      notes: 'Confirmed spam review, removed from platform'
    },
    {
      _id: '3',
      contentType: 'user',
      contentId: 'user789',
      reporterId: 'user3',
      reporterName: 'Mike Johnson',
      reason: 'Harassment',
      description: 'User is sending threatening messages to other users',
      status: 'resolved',
      priority: 'urgent',
      createdAt: '2024-01-13T08:15:00Z',
      reviewedAt: '2024-01-13T10:30:00Z',
      reviewedBy: 'moderator1',
      action: 'suspended',
      notes: 'User suspended for 30 days due to harassment'
    }
  ];

  const sampleDisputes: Dispute[] = [
    {
      _id: '1',
      type: 'refund',
      buyerId: 'buyer1',
      buyerName: 'Alice Brown',
      sellerId: 'seller1',
      sellerName: 'Auto Parts Pro',
      orderId: 'order123',
      description: 'Received wrong part, seller refuses to provide refund',
      status: 'open',
      priority: 'high',
      createdAt: '2024-01-15T12:00:00Z',
      updatedAt: '2024-01-15T12:00:00Z'
    },
    {
      _id: '2',
      type: 'quality',
      buyerId: 'buyer2',
      buyerName: 'Bob Wilson',
      sellerId: 'seller2',
      sellerName: 'Quality Parts Co',
      orderId: 'order456',
      description: 'Part arrived damaged and not as described',
      status: 'under_review',
      priority: 'medium',
      createdAt: '2024-01-14T16:30:00Z',
      updatedAt: '2024-01-15T11:20:00Z',
      assignedTo: 'moderator1'
    }
  ];

  useEffect(() => {
    loadModerationData();
  }, []);

  const loadModerationData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Fallback to sample data if no token
        setReportedContent(sampleReports);
        setDisputes(sampleDisputes);
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Load reports and disputes in parallel
      const [reportsResponse, disputesResponse] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/moderation/reports`, { headers }),
        axios.get(`${API_BASE_URL}/moderation/disputes`, { headers })
      ]);

      if (reportsResponse.status === 'fulfilled') {
        setReportedContent(reportsResponse.value.data);
      } else {
        console.error('Failed to load reports:', reportsResponse.reason);
        setReportedContent(sampleReports);
      }

      if (disputesResponse.status === 'fulfilled') {
        setDisputes(disputesResponse.value.data);
      } else {
        console.error('Failed to load disputes:', disputesResponse.reason);
        setDisputes(sampleDisputes);
      }
    } catch (error) {
      console.error('Error loading moderation data:', error);
      // Fallback to sample data
      setReportedContent(sampleReports);
      setDisputes(sampleDisputes);
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId: string, action: string, notes: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.put(
        `${API_BASE_URL}/moderation/reports/${reportId}`,
        { action, notes },
        { headers }
      );

      // Update local state
      const updatedReports = reportedContent.map(report => 
        report._id === reportId ? response.data : report
      );
      setReportedContent(updatedReports);
      setShowReportDialog(false);
      setSelectedReport(null);
      toast.success(`Report ${action} successfully`);
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
    }
  };

  const handleDisputeAction = async (disputeId: string, action: string, resolution: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.put(
        `${API_BASE_URL}/moderation/disputes/${disputeId}`,
        { status: 'resolved', resolution },
        { headers }
      );

      // Update local state
      const updatedDisputes = disputes.map(dispute => 
        dispute._id === disputeId ? response.data : dispute
      );
      setDisputes(updatedDisputes);
      setShowDisputeDialog(false);
      setSelectedDispute(null);
      toast.success(`Dispute ${action} successfully`);
    } catch (error) {
      console.error('Error updating dispute:', error);
      toast.error('Failed to update dispute');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'dismissed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredReports = reportedContent.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || report.priority === filterPriority;
    const matchesSearch = report.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const filteredDisputes = disputes.filter(dispute => {
    const matchesStatus = filterStatus === 'all' || dispute.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || dispute.priority === filterPriority;
    const matchesSearch = dispute.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p>Loading moderation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Content Moderation & Dispute Resolution</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage reported content, resolve disputes, and maintain platform integrity
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={loadModerationData}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'reports'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Flag className="w-4 h-4 inline mr-2" />
          Reported Content ({reportedContent.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'disputes'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Disputes ({disputes.filter(d => d.status === 'open').length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'audit'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Audit Trail
        </button>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-black dark:text-white mb-2 block">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by name, reason, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label className="text-black dark:text-white mb-2 block">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:w-48">
              <Label className="text-black dark:text-white mb-2 block">Priority</Label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reported Content Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report._id} className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-black dark:text-white">
                        {report.reason}
                      </h3>
                      <span className={`inline-block px-3 py-1 text-xs rounded-full ${getPriorityColor(report.priority)}`}>
                        {report.priority.toUpperCase()}
                      </span>
                      <span className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                        {report.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Reporter:</strong> {report.reporterName}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Content Type:</strong> {report.contentType}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Description:</strong> {report.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Reported on {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    {report.notes && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        <strong>Notes:</strong> {report.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2 ml-6">
                    {report.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => {
                            setSelectedReport(report);
                            setShowReportDialog(true);
                          }}
                          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      </>
                    )}
                    {report.status === 'reviewed' && (
                      <div className="text-sm text-gray-500 dark:text-gray-500">
                        Reviewed by {report.reviewedBy}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Disputes Tab */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          {filteredDisputes.map((dispute) => (
            <Card key={dispute._id} className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-black dark:text-white">
                        {dispute.type.toUpperCase()} Dispute
                      </h3>
                      <span className={`inline-block px-3 py-1 text-xs rounded-full ${getPriorityColor(dispute.priority)}`}>
                        {dispute.priority.toUpperCase()}
                      </span>
                      <span className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusColor(dispute.status)}`}>
                        {dispute.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Buyer:</strong> {dispute.buyerName}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Seller:</strong> {dispute.sellerName}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Order ID:</strong> {dispute.orderId}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Description:</strong> {dispute.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Created on {new Date(dispute.createdAt).toLocaleDateString()}
                    </p>
                    {dispute.resolution && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        <strong>Resolution:</strong> {dispute.resolution}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2 ml-6">
                    {dispute.status === 'open' && (
                      <Button
                        onClick={() => {
                          setSelectedDispute(dispute);
                          setShowDisputeDialog(true);
                        }}
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                        size="sm"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Resolve
                      </Button>
                    )}
                    {dispute.status === 'under_review' && (
                      <div className="text-sm text-gray-500 dark:text-gray-500">
                        Assigned to {dispute.assignedTo}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Audit Trail Tab */}
      {activeTab === 'audit' && (
        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Moderation Audit Trail</CardTitle>
            <CardDescription>Track all moderation actions and decisions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportedContent
                .filter(report => report.status !== 'pending')
                .map((report) => (
                  <div key={report._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-black dark:text-white">
                          {report.reason} - {report.reporterName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Action: {report.action} | Reviewed by: {report.reviewedBy}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {new Date(report.reviewedAt!).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {report.action === 'removed' && <Trash2 className="w-4 h-4 text-red-500" />}
                        {report.action === 'warned' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                        {report.action === 'suspended' && <Ban className="w-4 h-4 text-orange-500" />}
                        {report.action === 'dismissed' && <X className="w-4 h-4 text-gray-500" />}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Review Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>Review Reported Content</DialogTitle>
            <DialogDescription>
              Take action on the reported content
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <Label className="text-black dark:text-white">Action</Label>
                <Select defaultValue="warned">
                  <SelectTrigger className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warned">Warn User</SelectItem>
                    <SelectItem value="removed">Remove Content</SelectItem>
                    <SelectItem value="suspended">Suspend User</SelectItem>
                    <SelectItem value="dismissed">Dismiss Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-black dark:text-white">Notes</Label>
                <Textarea
                  placeholder="Add notes about the decision..."
                  className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReportDialog(false)}
              className="border border-gray-300 dark:border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleReportAction(selectedReport!._id, 'warned', 'User warned for inappropriate content')}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              Take Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispute Resolution Dialog */}
      <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
        <DialogContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              Provide a resolution for the dispute
            </DialogDescription>
          </DialogHeader>
          {selectedDispute && (
            <div className="space-y-4">
              <div>
                <Label className="text-black dark:text-white">Resolution</Label>
                <Select defaultValue="refund">
                  <SelectTrigger className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="refund">Issue Refund</SelectItem>
                    <SelectItem value="replacement">Send Replacement</SelectItem>
                    <SelectItem value="partial_refund">Partial Refund</SelectItem>
                    <SelectItem value="dismissed">Dismiss Dispute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-black dark:text-white">Resolution Notes</Label>
                <Textarea
                  placeholder="Explain the resolution decision..."
                  className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDisputeDialog(false)}
              className="border border-gray-300 dark:border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDisputeAction(selectedDispute!._id, 'resolved', 'Refund issued to buyer')}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              Resolve Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentModerationPage;
