import React, { useEffect, useState } from "react";
import axios from "axios";
import { Download } from "lucide-react";

const CertificateSection = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT token
        const res = await axios.get("/api/certificates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCertificates(res.data);
      } catch (err) {
        console.error("Error fetching certificates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">Loading certificates...</p>
      </div>
    );

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6">Your Certificates</h2>

      {certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <p className="text-gray-500 text-lg mb-4">You have no certificates yet.</p>
          <p className="text-gray-400">Complete a course to see your certificates here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <p className="font-semibold text-lg">{cert.courseName}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Issued on: {new Date(cert.issuedAt).toLocaleDateString()}
                </p>
                {cert.instructor && (
                  <p className="text-gray-400 text-sm mt-1">Instructor: {cert.instructor}</p>
                )}
              </div>
              <a
                href={cert.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificateSection;
