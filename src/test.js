// Fix: Move the performance metrics and other adModalData-dependent code inside the modal condition

// Replace this section in your component (around line 380-450):
{showAdModal && adModalData && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white border border-black max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-black">Ad Details</h2>
        <button
          onClick={closeAdModal}
          className="text-gray-400 hover:text-black"
        >
          <X size={24} />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-6 space-y-6">
        {/* Ad Image */}
        {adModalData.imageUrl && (
          <div className="text-center">
            <img 
              src={adModalData.imageUrl} 
              alt={adModalData.businessName}
              className="max-w-full h-auto max-h-64 mx-auto object-contain border border-gray-200"
            />
          </div>
        )}

        {/* Business Information */}
        <div className="border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Building className="mr-2" size={20} />
            Business Information
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Business Name</label>
              <p className="text-xl font-bold text-black">{adModalData.businessName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <p className="text-black leading-relaxed">{adModalData.adDescription}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Location</label>
              <p className="text-black">{adModalData.businessLocation}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Website</label>
              <a 
                href={adModalData.businessLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                {adModalData.businessLink}
                <ExternalLink className="ml-1" size={14} />
              </a>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Contact Email</label>
              <p className="text-black">{adModalData.adOwnerEmail}</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="mr-2" size={20} />
            Performance
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 border border-gray-200">
              <div className="text-2xl font-bold text-black">{adModalData.views || 0}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center">
                <Eye className="mr-1" size={14} />
                Views
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 border border-gray-200">
              <div className="text-2xl font-bold text-black">{adModalData.clicks || 0}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center">
                <MousePointer className="mr-1" size={14} />
                Clicks
              </div>
            </div>
          </div>
          {adModalData.views > 0 && (
            <div className="mt-4 text-center">
              <label className="text-sm font-medium text-gray-600">Click-through Rate</label>
              <p className="text-lg font-semibold text-black">
                {((adModalData.clicks || 0) / adModalData.views * 100).toFixed(2)}%
              </p>
            </div>
          )}
        </div>

        {/* Status & Timeline */}
        <div className="border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="mr-2" size={20} />
            Status & Timeline
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Current Status</label>
              <div className="flex items-center mt-1">
                {adModalData.status === 'active' ? (
                  <CheckCircle className="mr-2 text-green-600" size={16} />
                ) : adModalData.status === 'pending' ? (
                  <Clock className="mr-2 text-yellow-600" size={16} />
                ) : (
                  <XCircle className="mr-2 text-red-600" size={16} />
                )}
                <span className={`font-semibold ${
                  adModalData.status === 'active' ? 'text-green-600' :
                  adModalData.status === 'pending' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {adModalData.status?.charAt(0).toUpperCase() + adModalData.status?.slice(1) || 'Unknown'}
                </span>
              </div>
            </div>
            
            {adModalData.createdAt && (
              <div>
                <label className="text-sm font-medium text-gray-600">Created</label>
                <p className="text-black">{formatDate(adModalData.createdAt)}</p>
              </div>
            )}
            
            {adModalData.websiteSelection?.approvedAt && (
              <div>
                <label className="text-sm font-medium text-gray-600">Approved</label>
                <p className="text-black">{formatDate(adModalData.websiteSelection.approvedAt)}</p>
              </div>
            )}
            
            {adModalData.websiteSelection?.rejectionDeadline && (
              <div>
                <label className="text-sm font-medium text-gray-600">Rejection Deadline</label>
                <p className="text-black">{formatDate(adModalData.websiteSelection.rejectionDeadline)}</p>
                <p className="text-sm text-gray-600">
                  Time remaining: {getTimeRemaining(adModalData.websiteSelection.rejectionDeadline)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Details */}
        {(adModalData.targetAudience || adModalData.adObjective || adModalData.budget) && (
          <div className="border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
            <div className="space-y-3">
              {adModalData.targetAudience && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Target Audience</label>
                  <p className="text-black">{adModalData.targetAudience}</p>
                </div>
              )}
              {adModalData.adObjective && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Campaign Objective</label>
                  <p className="text-black">{adModalData.adObjective}</p>
                </div>
              )}
              {adModalData.budget && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Campaign Budget</label>
                  <p className="text-black">{formatCurrency(adModalData.budget)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Ad ID: {adModalData._id}
            </div>
            <div className="flex gap-3">
              {adModalData.imageUrl && (
                <Button
                  variant="outline"
                  onClick={() => window.open(adModalData.imageUrl, '_blank')}
                >
                  <ExternalLink className="mr-2" size={16} />
                  View Media
                </Button>
              )}
              {adModalData.businessLink && (
                <Button
                  variant="outline"
                  onClick={() => window.open(adModalData.businessLink, '_blank')}
                >
                  <ExternalLink className="mr-2" size={16} />
                  Visit Target Site
                </Button>
              )}
              <Button variant="primary" onClick={closeAdModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

// REMOVE the standalone performance metrics and status sections that are currently outside the modal condition
// They should only exist inside the modal above