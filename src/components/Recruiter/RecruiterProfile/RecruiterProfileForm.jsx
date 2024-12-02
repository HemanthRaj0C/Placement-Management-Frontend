import React from 'react';

const RecruiterProfileForm = ({ 
    formData, 
    handleInputChange, 
    handleSubmit, 
    newRecruiter,
    setIsEditMode 
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Company Name</label>
                <input 
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>Company Email</label>
                <input 
                    name="companyEmail"
                    type="email"
                    value={formData.companyEmail}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>Company About</label>
                <textarea 
                    name="companyAbout"
                    value={formData.companyAbout}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>Company Headquarters</label>
                <input 
                    name="companyHeadquarters"
                    value={formData.companyHeadquarters}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>Company Industry</label>
                <input 
                    name="companyIndustry"
                    value={formData.companyIndustry}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>Company Type</label>
                <select 
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Company Type</option>
                    <option value="Startup">Startup</option>
                    <option value="Mid-Size">Mid-Size</option>
                    <option value="Enterprise">Enterprise</option>
                </select>
            </div>
            <div>
                <label>Company LinkedIn</label>
                <input 
                    name="companyLinkedIn"
                    type="url"
                    value={formData.companyLinkedIn}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>Company Website</label>
                <input 
                    name="companyWebsite"
                    type="url"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <button type="submit">
                    {newRecruiter ? "Create Profile" : "Save Profile"}
                </button>
                {!newRecruiter && (
                    <button type="button" onClick={() => setIsEditMode(false)}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default RecruiterProfileForm;