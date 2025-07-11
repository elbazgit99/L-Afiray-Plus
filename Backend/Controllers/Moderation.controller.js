import mongoose from 'mongoose';

// Create schemas for moderation data
const ReportSchema = new mongoose.Schema({
  contentType: {
    type: String,
    enum: ['part', 'review', 'user', 'message'],
    required: true
  },
  contentId: {
    type: String,
    required: true
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reporterName: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    enum: ['warned', 'removed', 'suspended', 'dismissed']
  },
  notes: String
}, { timestamps: true });

const DisputeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['refund', 'quality', 'delivery', 'communication', 'other'],
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyerName: {
    type: String,
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerName: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'under_review', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolution: String
}, { timestamps: true });

const Report = mongoose.model('Report', ReportSchema);
const Dispute = mongoose.model('Dispute', DisputeSchema);

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporterId', 'name email')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new report
export const createReport = async (req, res) => {
  try {
    const { contentType, contentId, reason, description } = req.body;
    
    const report = new Report({
      contentType,
      contentId,
      reporterId: req.user._id,
      reporterName: req.user.name,
      reason,
      description
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(400).json({ error: error.message });
  }
};

// Update report status
export const updateReport = async (req, res) => {
  try {
    const { action, notes } = req.body;
    const { id } = req.params;

    const report = await Report.findByIdAndUpdate(
      id,
      {
        status: 'resolved',
        reviewedAt: new Date(),
        reviewedBy: req.user._id,
        action,
        notes
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get all disputes
export const getAllDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find()
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });
    res.json(disputes);
  } catch (error) {
    console.error('Error fetching disputes:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new dispute
export const createDispute = async (req, res) => {
  try {
    const { type, sellerId, sellerName, orderId, description } = req.body;
    
    const dispute = new Dispute({
      type,
      buyerId: req.user._id,
      buyerName: req.user.name,
      sellerId,
      sellerName,
      orderId,
      description
    });

    await dispute.save();
    res.status(201).json(dispute);
  } catch (error) {
    console.error('Error creating dispute:', error);
    res.status(400).json({ error: error.message });
  }
};

// Update dispute status
export const updateDispute = async (req, res) => {
  try {
    const { status, resolution } = req.body;
    const { id } = req.params;

    const dispute = await Dispute.findByIdAndUpdate(
      id,
      {
        status,
        resolution,
        assignedTo: req.user._id,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }

    res.json(dispute);
  } catch (error) {
    console.error('Error updating dispute:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get moderation statistics
export const getModerationStats = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });
    
    const totalDisputes = await Dispute.countDocuments();
    const openDisputes = await Dispute.countDocuments({ status: 'open' });
    const resolvedDisputes = await Dispute.countDocuments({ status: 'resolved' });

    const urgentReports = await Report.countDocuments({ priority: 'urgent', status: 'pending' });
    const highPriorityDisputes = await Dispute.countDocuments({ priority: 'high', status: 'open' });

    res.json({
      reports: {
        total: totalReports,
        pending: pendingReports,
        resolved: resolvedReports,
        urgent: urgentReports
      },
      disputes: {
        total: totalDisputes,
        open: openDisputes,
        resolved: resolvedDisputes,
        highPriority: highPriorityDisputes
      }
    });
  } catch (error) {
    console.error('Error fetching moderation stats:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get audit trail
export const getAuditTrail = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const reports = await Report.find({ status: { $ne: 'pending' } })
      .populate('reporterId', 'name')
      .populate('reviewedBy', 'name')
      .sort({ reviewedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const disputes = await Dispute.find({ status: { $in: ['resolved', 'closed'] } })
      .populate('buyerId', 'name')
      .populate('sellerId', 'name')
      .populate('assignedTo', 'name')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Combine and sort by date
    const auditTrail = [...reports, ...disputes].sort((a, b) => {
      const dateA = a.reviewedAt || a.updatedAt;
      const dateB = b.reviewedAt || b.updatedAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    res.json(auditTrail);
  } catch (error) {
    console.error('Error fetching audit trail:', error);
    res.status(500).json({ error: error.message });
  }
}; 