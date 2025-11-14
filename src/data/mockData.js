// Mock data for the research paper review platform

export const mockUsers = [
  {
    id: 1,
    email: 'author@example.com',
    password: 'password123',
    name: 'Dr. Sarah Johnson',
    role: 'author',
    affiliation: 'University of Technology',
    department: 'Computer Science'
  },
  {
    id: 2,
    email: 'reviewer@example.com',
    password: 'password123',
    name: 'Prof. Michael Chen',
    role: 'reviewer',
    affiliation: 'Stanford University',
    department: 'Computer Science',
    expertise: ['Machine Learning', 'Artificial Intelligence', 'Data Science']
  },
  {
    id: 3,
    email: 'admin@example.com',
    password: 'password123',
    name: 'Dr. Emily Rodriguez',
    role: 'admin',
    affiliation: 'Journal Editorial Board',
    department: 'Editorial'
  }
];

export const mockPapers = [
  {
    id: 1,
    title: 'Advanced Machine Learning Techniques for Natural Language Processing',
    authors: ['Dr. Sarah Johnson', 'Dr. Alex Thompson'],
    abstract: 'This paper presents novel approaches to improving natural language processing through advanced machine learning techniques...',
    keywords: ['Machine Learning', 'NLP', 'Deep Learning', 'Text Processing'],
    status: 'published',
    submissionDate: '2024-01-15',
    publicationDate: '2024-03-20',
    doi: '10.1000/example.2024.001',
    pdfUrl: '/papers/paper1.pdf',
    category: 'Computer Science',
    wordCount: 8500,
    citationCount: 12
  },
  {
    id: 2,
    title: 'Quantum Computing Applications in Cryptography',
    authors: ['Prof. David Wilson', 'Dr. Lisa Park'],
    abstract: 'We explore the potential of quantum computing to revolutionize cryptographic systems and security protocols...',
    keywords: ['Quantum Computing', 'Cryptography', 'Security', 'Quantum Algorithms'],
    status: 'published',
    submissionDate: '2024-02-01',
    publicationDate: '2024-04-15',
    doi: '10.1000/example.2024.002',
    pdfUrl: '/papers/paper2.pdf',
    category: 'Computer Science',
    wordCount: 9200,
    citationCount: 8
  },
  {
    id: 3,
    title: 'Sustainable Energy Solutions for Smart Cities',
    authors: ['Dr. Maria Garcia', 'Prof. James Brown'],
    abstract: 'This research investigates sustainable energy solutions and their implementation in smart city infrastructure...',
    keywords: ['Sustainable Energy', 'Smart Cities', 'Renewable Energy', 'Urban Planning'],
    status: 'under_review',
    submissionDate: '2024-03-10',
    category: 'Environmental Science',
    wordCount: 7800,
    assignedReviewers: [2],
    reviewDeadline: '2024-04-15'
  },
  {
    id: 4,
    title: 'Biomedical Applications of Artificial Intelligence',
    authors: ['Dr. Robert Kim', 'Dr. Jennifer Lee'],
    abstract: 'We present comprehensive analysis of AI applications in biomedical research and clinical practice...',
    keywords: ['Artificial Intelligence', 'Biomedical', 'Healthcare', 'Machine Learning'],
    status: 'submitted',
    submissionDate: '2024-03-20',
    category: 'Biomedical Engineering',
    wordCount: 9500,
    submissionFee: 150,
    paymentStatus: 'pending'
  }
];

export const mockReviews = [
  {
    id: 1,
    paperId: 3,
    reviewerId: 2,
    reviewerName: 'Prof. Michael Chen',
    rating: 4,
    comments: 'This is a well-researched paper with significant contributions to the field. The methodology is sound and the results are promising. Minor revisions suggested.',
    recommendation: 'accept_with_revisions',
    submittedDate: '2024-04-10',
    status: 'completed'
  }
];

export const mockNotifications = [
  {
    id: 1,
    userId: 1,
    title: 'Paper Submission Confirmed',
    message: 'Your paper "Biomedical Applications of Artificial Intelligence" has been successfully submitted.',
    type: 'success',
    read: false,
    timestamp: '2024-03-20T10:30:00Z'
  },
  {
    id: 2,
    userId: 2,
    title: 'New Review Assignment',
    message: 'You have been assigned to review "Sustainable Energy Solutions for Smart Cities".',
    type: 'info',
    read: false,
    timestamp: '2024-03-15T14:20:00Z'
  }
];

// Mock API functions
export const mockAPI = {
  // Authentication
  login: async (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      return { success: true, user: { ...user, password: undefined } };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  register: async (userData) => {
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      role: 'author'
    };
    mockUsers.push(newUser);
    return { success: true, user: { ...newUser, password: undefined } };
  },

  // Papers
  getPublishedPapers: async () => {
    return mockPapers.filter(paper => paper.status === 'published');
  },

  getAllPapers: async () => {
    return mockPapers;
  },

  getPaperById: async (id) => {
    return mockPapers.find(paper => paper.id === parseInt(id));
  },

  submitPaper: async (paperData) => {
    const newPaper = {
      id: mockPapers.length + 1,
      ...paperData,
      status: 'submitted',
      submissionDate: new Date().toISOString().split('T')[0]
    };
    mockPapers.push(newPaper);
    return { success: true, paper: newPaper };
  },

  // Reviews
  getReviewsByReviewer: async (reviewerId) => {
    return mockReviews.filter(review => review.reviewerId === reviewerId);
  },

  getReviewsByPaper: async (paperId) => {
    return mockReviews.filter(review => review.paperId === paperId);
  },

  submitReview: async (reviewData) => {
    const newReview = {
      id: mockReviews.length + 1,
      ...reviewData,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    mockReviews.push(newReview);
    return { success: true, review: newReview };
  },

  // Admin functions
  assignReviewer: async (paperId, reviewerId) => {
    const paper = mockPapers.find(p => p.id === paperId);
    if (paper) {
      if (!paper.assignedReviewers) paper.assignedReviewers = [];
      paper.assignedReviewers.push(reviewerId);
      return { success: true };
    }
    return { success: false, error: 'Paper not found' };
  },

  publishPaper: async (paperId) => {
    const paper = mockPapers.find(p => p.id === paperId);
    if (paper) {
      paper.status = 'published';
      paper.publicationDate = new Date().toISOString().split('T')[0];
      paper.doi = `10.1000/example.2024.${paperId.toString().padStart(3, '0')}`;
      return { success: true };
    }
    return { success: false, error: 'Paper not found' };
  },

  // Notifications
  getNotifications: async (userId) => {
    return mockNotifications.filter(notif => notif.userId === userId);
  },

  markNotificationRead: async (notificationId) => {
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      return { success: true };
    }
    return { success: false };
  }
};
