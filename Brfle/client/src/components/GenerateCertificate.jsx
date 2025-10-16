"use client"

import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { 
  Download, 
  ArrowLeft, 
  Award, 
  CheckCircle, 
  Printer, 
  Share2,
  Calendar,
  Clock,
  User,
  BookOpen,
  Sparkles,
  Eye,
  EyeOff
} from "lucide-react"
import { fetchCertificate } from "../store/slices/enrollmentSlice"

const GenerateCertificate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()
  
  const { currentCourse } = useSelector((state) => state.courses)
  const { courseProgress, certificate, loading } = useSelector((state) => state.enrollments)
  const { user } = useSelector((state) => state.auth)

  const [isGenerating, setIsGenerating] = useState(false)
  const [showWatermark, setShowWatermark] = useState(true)
  const [certificateData, setCertificateData] = useState(null)
  const certificateRef = useRef(null)

  // Fetch certificate when component mounts
  useEffect(() => {
    if (courseId) {
      dispatch(fetchCertificate(courseId))
    }
    console.log("user",user);
  }, [courseId, dispatch])

  // Check if course is completed
  const isCourseCompleted = courseProgress?.percentage === 100

  // Mock certificate data - replace with actual data from API
  const mockCertificateData = {
    
    certificateId: `CERT-${Date.now()}`,
    studentName: user?.FullName || "Student Name",
    courseName: currentCourse?.courseTitle || "Course Title",
    completionDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    issueDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    duration: currentCourse?.duration || "8 weeks",
    instructor: "Course Instructor",
    grade: "A+",
    score: "98%"
  }

  const handleDownload = async (format = 'pdf') => {
    if (!isCourseCompleted) {
      alert("Please complete the course to download your certificate.")
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate certificate generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create a temporary link for download
      const link = document.createElement('a')
      
      if (format === 'pdf') {
        // For PDF download (this would typically come from your backend)
        link.href = '/api/certificate/download' // Replace with actual API endpoint
        link.download = `Certificate-${currentCourse?.courseTitle}-${user?.name}.pdf`
      } else {
        // For PNG download - capture the certificate as image
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        })
        link.href = canvas.toDataURL('image/png')
        link.download = `Certificate-${currentCourse?.courseTitle}-${user?.name}.png`
      }
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      console.error('Error downloading certificate:', error)
      alert('Failed to download certificate. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    if (!isCourseCompleted) {
      alert("Please complete the course to print your certificate.")
      return
    }

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const certificateHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Certificate - ${mockCertificateData.courseName}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
              
              body { 
                margin: 0; 
                padding: 0; 
                background: #f8fafc;
                font-family: 'Inter', sans-serif;
              }
              
              .certificate-container {
                width: 210mm;
                height: 297mm;
                margin: 0 auto;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                position: relative;
                overflow: hidden;
              }
              
              .certificate-content {
                background: white;
                margin: 20mm;
                height: calc(297mm - 40mm);
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                position: relative;
                overflow: hidden;
              }
              
              .watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 120px;
                color: rgba(0,0,0,0.03);
                font-weight: bold;
                white-space: nowrap;
                pointer-events: none;
              }
              
              .certificate-header {
                text-align: center;
                padding: 40px 0 20px;
                border-bottom: 3px solid #e2e8f0;
                margin: 0 40px;
              }
              
              .certificate-title {
                font-family: 'Playfair Display', serif;
                font-size: 48px;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 10px;
              }
              
              .certificate-subtitle {
                font-size: 18px;
                color: #64748b;
                letter-spacing: 4px;
                text-transform: uppercase;
              }
              
              .certificate-body {
                padding: 60px 80px;
                text-align: center;
              }
              
              .presented-to {
                font-size: 24px;
                color: #64748b;
                margin-bottom: 20px;
              }
              
              .student-name {
                font-family: 'Playfair Display', serif;
                font-size: 52px;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              
              .completion-text {
                font-size: 20px;
                color: #475569;
                margin-bottom: 30px;
                line-height: 1.6;
              }
              
              .course-name {
                font-size: 32px;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 40px;
                font-family: 'Playfair Display', serif;
              }
              
              .certificate-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin: 50px 0;
                text-align: left;
              }
              
              .detail-item {
                margin-bottom: 15px;
              }
              
              .detail-label {
                font-size: 14px;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
              }
              
              .detail-value {
                font-size: 18px;
                color: #1e293b;
                font-weight: 600;
              }
              
              .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 60px;
                padding-top: 40px;
                border-top: 2px solid #e2e8f0;
              }
              
              .signature {
                text-align: center;
              }
              
              .signature-line {
                width: 200px;
                height: 1px;
                background: #cbd5e1;
                margin: 40px 0 10px;
              }
              
              .signature-name {
                font-weight: 600;
                color: #1e293b;
              }
              
              .signature-title {
                font-size: 14px;
                color: #64748b;
              }
              
              .certificate-footer {
                text-align: center;
                padding: 30px;
                background: #f8fafc;
                margin-top: 40px;
              }
              
              .certificate-id {
                font-family: 'Monaco', 'Courier New', monospace;
                color: #64748b;
                font-size: 14px;
              }
              
              .verification-note {
                font-size: 12px;
                color: #94a3b8;
                margin-top: 10px;
              }
              
              @media print {
                body { background: white; }
                .certificate-container { 
                  margin: 0; 
                  box-shadow: none;
                }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            <div class="certificate-container">
              <div class="certificate-content">
                ${showWatermark ? '<div class="watermark">CERTIFICATE OF COMPLETION</div>' : ''}
                
                <div class="certificate-header">
                  <div class="certificate-title">Certificate</div>
                  <div class="certificate-subtitle">of Achievement</div>
                </div>
                
                <div class="certificate-body">
                  <div class="presented-to">This certificate is proudly presented to</div>
                  <div class="student-name">${mockCertificateData.studentName}</div>
                  
                  <div class="completion-text">
                    has successfully completed the course
                  </div>
                  
                  <div class="course-name">${mockCertificateData.courseName}</div>
                  
                  <div class="certificate-details">
                    <div>
                      <div class="detail-item">
                        <div class="detail-label">Completion Date</div>
                        <div class="detail-value">${mockCertificateData.completionDate}</div>
                      </div>
                      <div class="detail-item">
                        <div class="detail-label">Duration</div>
                        <div class="detail-value">${mockCertificateData.duration}</div>
                      </div>
                    </div>
                    <div>
                      <div class="detail-item">
                        <div class="detail-label">Grade Achieved</div>
                        <div class="detail-value">${mockCertificateData.grade} (${mockCertificateData.score})</div>
                      </div>
                      <div class="detail-item">
                        <div class="detail-label">Certificate ID</div>
                        <div class="detail-value">${mockCertificateData.certificateId}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="signatures">
                    <div class="signature">
                      <div class="signature-line"></div>
                      <div class="signature-name">${mockCertificateData.instructor}</div>
                      <div class="signature-title">Course Instructor</div>
                    </div>
                    <div class="signature">
                      <div class="signature-line"></div>
                      <div class="signature-name">Learning Platform</div>
                      <div class="signature-title">Issuing Authority</div>
                    </div>
                  </div>
                </div>
                
                <div class="certificate-footer">
                  <div class="certificate-id">Certificate ID: ${mockCertificateData.certificateId}</div>
                  <div class="verification-note">
                    Verify this certificate at: platform.com/verify/${mockCertificateData.certificateId}
                  </div>
                </div>
              </div>
            </div>
            
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 1000);
              };
            </script>
          </body>
        </html>
      `
      
      printWindow.document.write(certificateHTML)
      printWindow.document.close()
    }
  }

  const handleShare = async () => {
    if (!isCourseCompleted) {
      alert("Please complete the course to share your certificate.")
      return
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Certificate - ${mockCertificateData.courseName}`,
          text: `I successfully completed ${mockCertificateData.courseName}! Check out my certificate.`,
          url: window.location.href,
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.log('Sharing failed:', error)
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Certificate link copied to clipboard!')
      } catch (err) {
        alert('Failed to copy link. Please copy the URL manually.')
      }
    }
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
          <button
            onClick={() => navigate('/my-courses')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    )
  }

  if (!isCourseCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/course/${courseId}/course-progress`)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Course Progress</span>
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Certificate - {currentCourse.courseTitle}
            </h1>
          </div>

          {/* Incomplete Course Message */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10 text-yellow-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Course Not Completed Yet
            </h2>

            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You need to complete all course sections to unlock your certificate. 
              Currently, you have completed {courseProgress?.percentage || 0}% of the course.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-yellow-700">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Complete all sections to earn your certificate</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(`/course/${courseId}/course-progress`)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Course Progress
              </button>
              
              <button
                onClick={() => navigate('/my-courses')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                View My Courses
              </button>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Overall Progress</span>
                  <span>{courseProgress?.percentage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${courseProgress?.percentage || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {courseProgress?.completedLessons?.length || 0}/{currentCourse.totalLessons || 0}
                  </div>
                  <div className="text-sm text-gray-600">Lessons</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {courseProgress?.accessedMaterials?.courseBook ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-600">Course Book</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {courseProgress?.accessedMaterials?.projectBook ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-600">Project Guide</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {courseProgress?.completedSections?.test ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-600">MCQ Test</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/course/${courseId}/course-progress`)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Course Progress</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Certificate of Completion
              </h1>
              <p className="text-gray-600">{currentCourse.courseTitle}</p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-600">Course Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Congratulations! Course completed successfully.</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowWatermark(!showWatermark)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {showWatermark ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>Watermark</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </button>
              
              <button
                onClick={() => handleDownload('png')}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>{isGenerating ? 'Generating...' : 'Download PNG'}</span>
              </button>
              
              <button
                onClick={() => handleDownload('pdf')}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div 
            ref={certificateRef}
            className="certificate-preview mx-auto max-w-4xl bg-gradient-to-br from-blue-50 to-purple-50 border-8 border-gold-200 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Certificate Content */}
            <div className="certificate-content bg-white m-8 rounded-2xl shadow-lg relative overflow-hidden">
              {/* Watermark */}
              {showWatermark && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-45deg] text-6xl md:text-8xl font-bold text-gray-100 whitespace-nowrap pointer-events-none">
                  CERTIFICATE OF COMPLETION
                </div>
              )}
              
              {/* Header */}
              <div className="certificate-header text-center py-8 border-b-2 border-gray-200 mx-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 font-serif mb-2">
                  Certificate
                </h1>
                <p className="text-lg text-gray-600 tracking-widest uppercase">
                  of Achievement
                </p>
              </div>
              
              {/* Body */}
              <div className="certificate-body py-12 px-8 md:px-16 text-center">
                <p className="text-xl text-gray-600 mb-6">
                  This certificate is proudly presented to
                </p>
                
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-serif mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {mockCertificateData.studentName}
                </h2>
                
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  has successfully completed the course and demonstrated outstanding 
                  commitment to learning and professional development
                </p>
                
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 font-serif mb-12">
                  {mockCertificateData.courseName}
                </h3>
                
                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                        Completion Date
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {mockCertificateData.completionDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                        Duration
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {mockCertificateData.duration}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                        Grade Achieved
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {mockCertificateData.grade} ({mockCertificateData.score})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                        Certificate ID
                      </p>
                      <p className="text-lg font-semibold text-gray-800 font-mono">
                        {mockCertificateData.certificateId}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Signatures */}
                <div className="flex justify-between items-end mt-12 pt-8 border-t-2 border-gray-200">
                  <div className="text-center">
                    <div className="w-32 h-px bg-gray-300 mx-auto mb-2"></div>
                    <p className="font-semibold text-gray-800">{mockCertificateData.instructor}</p>
                    <p className="text-sm text-gray-600">Course Instructor</p>
                  </div>
                  
                  <div className="text-center">
                    <Sparkles className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p className="font-semibold text-gray-800">Learning Platform</p>
                    <p className="text-sm text-gray-600">Issuing Authority</p>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="certificate-footer bg-gray-50 py-6 text-center">
                <p className="text-gray-600 font-mono text-sm">
                  Certificate ID: {mockCertificateData.certificateId}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Verify this certificate at: platform.com/verify/{mockCertificateData.certificateId}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About Your Certificate</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <Award className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Digital Credential</p>
                <p className="text-sm text-gray-600">Shareable digital certificate</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <User className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Verification</p>
                <p className="text-sm text-gray-600">Unique ID for verification</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="h-6 w-6 text-purple-600 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Lifetime Access</p>
                <p className="text-sm text-gray-600">Available anytime for download</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerateCertificate