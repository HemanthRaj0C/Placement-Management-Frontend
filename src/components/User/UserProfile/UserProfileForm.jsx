import React from 'react';

const UserProfileForm = ({ 
    formData, 
    handleInputChange, 
    handleSkillChange, 
    handleProjectLinkChange, 
    addProjectLink, 
    handleSubmit, 
    newUser,
    setIsEditMode 
}) => {
    return (
        <>
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name</label>
                <input 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>Last Name</label>
                <input 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>Email</label>
                <input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    required
                />
            </div>
            <div>
                <label>Mobile Number</label>
                <input 
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    type="tel"
                    required
                />
            </div>
            <div>
                <label>Degree</label>
                <select 
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Degree</option>
                    <option value="B.E">B.E</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.E">M.E</option>
                    <option value="PhD">PhD</option>
                </select>
            </div>
            <div>
                <label>Degree Status</label>
                <select 
                    name="degreeStatus"
                    value={formData.degreeStatus}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Status</option>
                    <option value="Pursuing">Pursuing</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <div>
                <label>Highest Qualification</label>
                <select 
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Qualification</option>
                    <option value="Higher Secondary">Higher Secondary</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Under Graduation">Under Graduation</option>
                    <option value="Post Graduation">Post Graduation</option>
                    <option value="PhD">PhD</option>
                </select>
            </div>
            <div>
                <label>Experience (Years)</label>
                <select 
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Experience</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
            <div>
                <label>Technical Skills (comma-separated)</label>
                <input 
                    value={formData.technicalSkills.join(', ')}
                    onChange={(e) => handleSkillChange('technicalSkills', e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Other Skills (comma-separated)</label>
                <input 
                    value={formData.otherSkills.join(', ')}
                    onChange={(e) => handleSkillChange('otherSkills', e.target.value)}
                />
            </div>
            <div>
                <label>Project Links</label>
                {formData.projectLinks.map((link, index) => (
                    <div key={index}>
                        <input 
                            value={link}
                            onChange={(e) => handleProjectLinkChange(index, e.target.value)}
                            placeholder="Enter project link"
                        />
                    </div>
                ))}
                <button type="button" onClick={addProjectLink}>
                    Add Project Link
                </button>
            </div>
            <div>
                <button type="submit">
                    {newUser ? "Create Profile" : "Save Profile"}
                </button>
                {!newUser && (
                    <button type="button" onClick={() => setIsEditMode(false)}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
        </>
    );
};

export default UserProfileForm;