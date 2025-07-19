import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { AlertCircle, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const PendingAds = () => {
  const [pendingAds, setPendingAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingAds = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        
        // Get the token from Clerk
        const token = await getToken();
        
        const response = await fetch(`https://yepper-backend.onrender.com/api/accept/pending/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPendingAds(data);
      } catch (error) {
        console.error('Error fetching pending ads:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingAds();
  }, [user?.id, getToken]);

  const handleApprove = async (adId, websiteId) => {
    try {
      const token = await getToken();
      
      const response = await fetch(
        `https://yepper-backend.onrender.com/api/accept/approve/${adId}/website/${websiteId}`, 
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state to reflect the approval
      setPendingAds(prevAds => 
        prevAds.map(ad => {
          if (ad._id === adId) {
            return {
              ...ad,
              websiteDetails: ad.websiteDetails.map(wd => ({
                ...wd,
                approved: wd.website._id === websiteId ? true : wd.approved
              }))
            };
          }
          return ad;
        })
      );
    } catch (error) {
      console.error('Error approving ad:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ultra-modern header with blur effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span className="font-medium tracking-wide">BACK</span>
          </button>
          <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-medium tracking-widest">APPROVAL</div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-12 bg-blue-500 mr-6"></div>
            <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Administration</span>
            <div className="h-px w-12 bg-blue-500 ml-6"></div>
          </div>
          
          <h1 className="text-center text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Ad Approval Dashboard
            </span>
          </h1>
          
        </div>

        {error && (
          <div className="max-w-xl mx-auto mb-16 backdrop-blur-md bg-red-900/30 rounded-xl border border-red-500/30 p-6">
            <div className="flex items-center">
              <AlertCircle className="text-red-400 mr-3" size={24} />
              <p className="text-white/90">Error loading pending ads: {error}</p>
            </div>
          </div>
        )}
        
        {pendingAds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pendingAds.map((ad) => (
              <div 
                key={ad._id}
                className="group backdrop-blur-md bg-gradient-to-b from-orange-900/30 to-orange-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.3)]"
              >
                <div className="relative aspect-video">
                  {ad.videoUrl ? (
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      className="w-full h-full object-cover"
                    >
                      <source src={ad.videoUrl} type="video/mp4" />
                    </video>
                  ) : (
                    ad.imageUrl && (
                      <img 
                        src={ad.imageUrl} 
                        alt={`${ad.businessName} ad visual`}
                        className="w-full h-full object-cover"
                      />
                    )
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white text-xl font-semibold mb-2">
                        {ad.businessName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm">
                          Pending Review
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-bold mb-3">{ad.businessName}</h3>
                  <p className="text-white/70 mb-6">{ad.adDescription}</p>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium uppercase tracking-wider text-purple-400">Selected Websites</h4>
                    {ad.websiteDetails.map((detail) => (
                      <div key={detail.website._id} className="border border-white/10 rounded-xl p-4 space-y-3 backdrop-blur-md bg-white/5">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium">{detail.website.websiteName}</h5>
                          <div className={`flex items-center px-3 py-1 rounded-full text-xs ${
                            detail.approved 
                              ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                              : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {detail.approved ? (
                              <>
                                <CheckCircle size={12} className="mr-1" />
                                <span>Approved</span>
                              </>
                            ) : (
                              <>
                                <Clock size={12} className="mr-1" />
                                <span>Pending</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-sm text-white/70">
                          <p className="mb-1">Selected Categories:</p>
                          <div className="flex flex-wrap gap-2">
                            {detail.categories.map(cat => (
                              <span key={cat._id} className="px-2 py-1 bg-white/10 rounded-full text-xs">
                                {cat.categoryName}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {!detail.approved && (
                          <button 
                            onClick={() => handleApprove(ad._id, detail.website._id)}
                            className="w-full group relative h-12 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-medium overflow-hidden transition-all duration-300"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative z-10 flex items-center justify-center">
                              <CheckCircle size={16} className="mr-2" />
                              <span className="uppercase tracking-wider">Approve for {detail.website.websiteName}</span>
                            </span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-lg mx-auto backdrop-blur-md bg-gradient-to-b from-gray-900/30 to-gray-900/10 rounded-3xl border border-white/10 overflow-hidden">
            <div className="p-12 text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white/5">
                  <AlertCircle className="text-white/70" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">No Pending Ads</h2>
                  <p className="text-white/60">All advertisements have been reviewed. Check back later for new submissions.</p>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="group relative h-12 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium overflow-hidden transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="uppercase tracking-wider">Return to Dashboard</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PendingAds;































// import React, { useEffect, useState } from 'react';
// import { useUser, useAuth } from "@clerk/clerk-react";
// import { AlertCircle } from 'lucide-react';
// import { Card, CardContent } from "./components/card";
// import LoadingSpinner from '../../components/LoadingSpinner';
// import Header from '../../components/backToPreviousHeader'

// const PendingAds = () => {
//   const [pendingAds, setPendingAds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useUser();
//   const { getToken } = useAuth();

//   useEffect(() => {
//     const fetchPendingAds = async () => {
//       if (!user?.id) return;

//       try {
//         setLoading(true);
//         setError(null);
        
//         // Get the token from Clerk
//         const token = await getToken();
        
//         const response = await fetch(`https://yepper-backend.onrender.com/api/accept/pending/${user.id}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
//         setPendingAds(data);
//       } catch (error) {
//         console.error('Error fetching pending ads:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPendingAds();
//   }, [user?.id, getToken]);

//   const handleApprove = async (adId, websiteId) => {
//     try {
//       const token = await getToken();
      
//       const response = await fetch(
//         `https://yepper-backend.onrender.com/api/accept/approve/${adId}/website/${websiteId}`, 
//         {
//           method: 'PUT',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       // Update local state to reflect the approval
//       setPendingAds(prevAds => 
//         prevAds.map(ad => {
//           if (ad._id === adId) {
//             return {
//               ...ad,
//               websiteDetails: ad.websiteDetails.map(wd => ({
//                 ...wd,
//                 approved: wd.website._id === websiteId ? true : wd.approved
//               }))
//             };
//           }
//           return ad;
//         })
//       );
//     } catch (error) {
//       console.error('Error approving ad:', error);
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <div>Error loading pending ads: {error}</div>;

//   return (
//     <div className="ad-waitlist min-h-screen">
//       <Header />
//       <div className="container mx-auto px-4 py-12 max-w-7xl">
//         <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mb-2">
//                 Ad Approval Dashboard
//               </h1>
//               <p className="text-gray-600">
//                 {pendingAds.length} {pendingAds.length === 1 ? 'advertisement' : 'advertisements'} awaiting review
//               </p>
//             </div>
//           </div>
//         </div>

//         {pendingAds.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
//             {pendingAds.map((ad) => (
//               <Card 
//                 key={ad._id} 
//                 className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
//               >
//                 <div className="relative aspect-video">
//                   {ad.videoUrl ? (
//                     <video 
//                       autoPlay 
//                       loop 
//                       muted 
//                       className="w-full h-full object-cover"
//                     >
//                       <source src={ad.videoUrl} type="video/mp4" />
//                     </video>
//                   ) : (
//                     ad.imageUrl && (
//                       <img 
//                         src={ad.imageUrl} 
//                         alt={`${ad.businessName} ad visual`}
//                         className="w-full h-full object-cover"
//                       />
//                     )
//                   )}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
//                     <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
//                       <h3 className="text-white text-xl font-semibold mb-2">
//                         {ad.businessName}
//                       </h3>
//                       <div className="flex items-center gap-2">
//                         <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm">
//                           Pending Review
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <CardContent className="p-6">
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-bold">{ad.businessName}</h3>
//                     <p className="text-sm text-gray-600">{ad.adDescription}</p>
                    
//                     <div className="space-y-4">
//                       <h4 className="font-semibold text-sm">Selected Websites:</h4>
//                       {ad.websiteDetails.map((detail) => (
//                         <div key={detail.website._id} className="border rounded-lg p-3 space-y-2">
//                           <div className="flex justify-between items-center">
//                             <h5 className="font-medium">{detail.website.websiteName}</h5>
//                             <span className={`px-2 py-1 rounded-full text-xs ${
//                               detail.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                             }`}>
//                               {detail.approved ? 'Approved' : 'Pending'}
//                             </span>
//                           </div>
                          
//                           <div className="text-sm text-gray-600">
//                             <p>Selected Categories:</p>
//                             <ul className="list-disc list-inside">
//                               {detail.categories.map(cat => (
//                                 <li key={cat._id}>{cat.categoryName}</li>
//                               ))}
//                             </ul>
//                           </div>
                          
//                           {!detail.approved && (
//                             <button 
//                               onClick={() => handleApprove(ad._id, detail.website._id)}
//                               className="w-full mt-2 px-3 py-2 bg-[#FF4500] hover:bg-orange-500 text-white text-sm font-bold rounded-md transition-all duration-300"
//                             >
//                               Approve for {detail.website.websiteName}
//                             </button>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         ) : (
//           <Card className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
//             <div className="p-12">
//               <div className="flex flex-col items-center text-center space-y-6">
//                 <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-50">
//                   <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-semibold mb-2 text-gray-800">No Pending Ads</h2>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PendingAds;