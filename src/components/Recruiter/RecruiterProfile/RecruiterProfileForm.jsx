import React from 'react';
import { Card, CardHeader, CardBody, Divider, Input, Select, SelectItem, Button } from "@nextui-org/react";
import { FaBuilding, FaEnvelope, FaMapMarkerAlt, FaIndustry, FaLink, FaUserTie, FaUserEdit } from "react-icons/fa";

const RecruiterProfileForm = ({ 
    formData, 
    handleInputChange, 
    handleSubmit, 
    newRecruiter,
    setIsEditMode
}) => {
    return (
        <Card className="bg-amber-900 text-white border border-amber-500/20 w-3/4 mx-auto">
            <CardHeader className="flex justify-between items-center bg-amber-950/50 py-4 px-6">
                <div className="flex gap-3 items-center">
                    <FaUserEdit className="text-2xl text-orange-400" />
                    <h2 className="text-xl font-semibold">
                        {newRecruiter ? 'Create Profile' : 'Edit Profile'}
                    </h2>
                </div>
            </CardHeader>
            <Divider className="bg-amber-500/20" />
            <CardBody className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4 text-white">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="Company Name"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            variant="bordered"
                            color="primary"
                            startContent={<FaBuilding className="text-orange-400" />}
                            required
                        />
                        <Input
                            label="Company Email"
                            name="companyEmail"
                            type="email"
                            value={formData.companyEmail}
                            onChange={handleInputChange}
                            variant="bordered"
                            color="primary"
                            startContent={<FaEnvelope className="text-orange-400" />}
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="Company About"
                            name="companyAbout"
                            value={formData.companyAbout}
                            onChange={handleInputChange}
                            variant="bordered"
                            color="primary"
                            startContent={<FaUserTie className="text-orange-400" />}
                            required
                        />
                        <Input
                            label="Company Headquarters"
                            name="companyHeadquarters"
                            value={formData.companyHeadquarters}
                            onChange={handleInputChange}
                            variant="bordered"
                            color="primary"
                            startContent={<FaMapMarkerAlt className="text-orange-400" />}
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="Company Industry"
                            name="companyIndustry"
                            value={formData.companyIndustry}
                            onChange={handleInputChange}
                            variant="bordered"
                            color="primary"
                            startContent={<FaIndustry className="text-orange-400" />}
                            required
                        />
                        <Select
                            label="Company Type"
                            name="companyType"
                            selectedKeys={formData.companyType ? [formData.companyType] : []}
                            onChange={handleInputChange}
                            variant="bordered"
                            color="primary"
                            startContent={<FaBuilding className="text-orange-400" />}
                            required
                        >
                            {['Startup', 'Mid-Size', 'Enterprise'].map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                            
                        </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="Company LinkedIn"
                            name="companyLinkedIn"
                            type="url"
                            value={formData.companyLinkedIn}
                            onChange={handleInputChange}
                            variant="bordered"
                            color="primary"
                            startContent={<FaLink className="text-orange-400" />}
                            required
                        />
                        <Input
                            label="Company Website"
                            name="companyWebsite"
                            type="url"
                            value={formData.companyWebsite}
                            onChange={handleInputChange}
                            variant="bordered"
                            color="primary"
                            startContent={<FaLink className="text-orange-400" />}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button type="submit" color="warning" auto>
                            {newRecruiter ? "Create Profile" : "Save Profile"}
                        </Button>
                        {!newRecruiter && (
                            <Button 
                                type="button" 
                                onClick={() => setIsEditMode(false)} 
                                color="error"
                                className="hover:bg-red-500 bg-red-600" 
                                auto
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </CardBody>
        </Card>
    );
};

export default RecruiterProfileForm;
