import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Divider, 
  Input, 
  Select, 
  SelectItem,
  Button
} from "@nextui-org/react";
import { 
  FaUser, 
  FaUserTie,
  FaBook,
  FaBriefcase,
  FaCode,
  FaLink,
  FaEnvelope, 
  FaPhoneAlt, 
  FaGraduationCap, 
  FaPlus, 
  FaTrash, 
  FaUserEdit
} from "react-icons/fa";

const ProfileCreationForm = ({
    initialFormData,
    formData,
    handleInputChange,
    handleSkillChange,
    handleProjectLinkChange,
    addProjectLink,
    handleSubmit,
    onCancel,
    isEditMode = false,
    newUser = false
}) => {
    const handleProjectLinkRemove = (index) => {
        const newProjectLinks = formData.projectLinks.filter((_, i) => i !== index);
        handleProjectLinkChange(newProjectLinks.map((link, i) => ({ target: { name: `projectLinks[${i}]`, value: link } })));
    };

    return (
        <Card className="bg-blue-950 text-white border border-blue-500/20 max-w-full mx-auto">
            <CardHeader className="flex justify-between items-center bg-blue-900/50 py-4 px-6">
                <div className="flex gap-3 items-center">
                    <FaUserEdit className="text-2xl text-cyan-400" />
                    <h2 className="text-xl font-semibold">
                        {isEditMode ? 'Edit Profile' : 'Create Profile'}
                    </h2>
                </div>
            </CardHeader>
            <Divider className="bg-blue-500/20" />
            <CardBody className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            variant="bordered"
                            color="primary"
                            startContent={<FaUserTie className="text-cyan-400" />}
                            required
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            variant="bordered"
                            color="primary"
                            startContent={<FaUser className="text-cyan-400" />}
                            required
                        />
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            variant="bordered"
                            color="primary"
                            startContent={<FaEnvelope className="text-cyan-400" />}
                            required
                        />
                        <Input
                            label="Mobile Number"
                            name="mobileNumber"
                            type="tel"
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                            variant="bordered"
                            color="primary"
                            startContent={<FaPhoneAlt className="text-cyan-400" />}
                            required
                        />
                    </div>

                    <Divider className="bg-blue-500/20 my-4" />

                    <div className="grid md:grid-cols-2 gap-4">
                        <Select
                            label="Degree"
                            name="degree"
                            variant="bordered"
                            color="primary"
                            startContent={<FaGraduationCap className="text-cyan-400" />}
                            selectedKeys={formData.degree ? [formData.degree] : []}
                            onChange={handleInputChange}
                            required
                        >
                            {['B.E', 'B.Tech', 'M.E', 'PhD'].map((degree) => (
                                <SelectItem key={degree} value={degree}>
                                    {degree}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            label="Degree Status"
                            name="degreeStatus"
                            variant="bordered"
                            color="primary"
                            startContent={<FaGraduationCap className="text-cyan-400" />}
                            selectedKeys={formData.degreeStatus ? [formData.degreeStatus] : []}
                            onChange={handleInputChange}
                            required
                        >
                            {['Pursuing', 'Completed'].map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            label="Highest Qualification"
                            name="highestQualification"
                            variant="bordered"
                            startContent={<FaBook className="text-cyan-400" />}
                            color="primary"
                            selectedKeys={formData.highestQualification ? [formData.highestQualification] : []}
                            onChange={handleInputChange}
                            required
                        >
                            {['Higher Secondary', 'Diploma', 'Under Graduation', 'Post Graduation', 'PhD'].map((qual) => (
                                <SelectItem key={qual} value={qual}>
                                    {qual}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            label="Experience (Years)"
                            name="experience"
                            variant="bordered"
                            startContent={<FaBriefcase className="text-cyan-400" />}
                            color="primary"
                            selectedKeys={formData.experience ? [formData.experience.toString()] : []}
                            onChange={handleInputChange}
                            required
                        >
                            {['0', '1', '2', '3', '4', '5'].map((exp) => (
                                <SelectItem key={exp} value={exp}>
                                    {exp}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>

                    <Divider className="bg-blue-500/20 my-4" />

                    <Input
                        label="Technical Skills (comma-separated)"
                        value={formData.technicalSkills.join(', ')}
                        onChange={(e) => handleSkillChange('technicalSkills', e.target.value)}
                        startContent={<FaCode className="text-cyan-400" />}
                        variant="bordered"
                        color="primary"
                        required
                    />

                    <Input
                        label="Other Skills (comma-separated)"
                        value={formData.otherSkills.join(', ')}
                        onChange={(e) => handleSkillChange('otherSkills', e.target.value)}
                        startContent={<FaCode className="text-cyan-400" />}
                        variant="bordered"
                        color="primary"
                    />

                    <div className="space-y-2">
                        <label className="text-white">Project Links</label>
                        {formData.projectLinks.map((link, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <Input
                                    value={link}
                                    onChange={(e) => handleProjectLinkChange(index, e.target.value)}
                                    startContent={<FaLink className="text-cyan-400" />}
                                    placeholder="Enter project link"
                                    variant="bordered"
                                    color="primary"
                                    className="flex-grow"
                                />
                                {index === formData.projectLinks.length - 1 && (
                                    <Button 
                                        isIconOnly 
                                        color="primary" 
                                        variant="light" 
                                        onClick={addProjectLink}
                                    >
                                        <FaPlus />
                                    </Button>
                                )}
                                {formData.projectLinks.length > 1 && (
                                    <Button 
                                        isIconOnly 
                                        color="danger" 
                                        variant="light" 
                                        onClick={() => handleProjectLinkRemove(index)}
                                    >
                                        <FaTrash />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button 
                            color="default" 
                            variant="bordered" 
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button 
                            color="primary" 
                            type="submit"
                        >
                            {isEditMode ? 'Update Profile' : 'Create Profile'}
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
};

export default ProfileCreationForm;