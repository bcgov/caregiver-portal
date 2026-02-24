import React from 'react';
import { Check, CircleDashed, CircleAlert, Flag, ExternalLink, BookText  } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';
import FileUpload from '../components/FileUpload';
import { useAttachments } from '../hooks/useAttachments';
import Declaration from '../components/Declaration';
import Button from '../components/Button';


const MedicalForms = () => {
  const { applicationPackageId, householdMemberId } = useParams();
  const navigate = useNavigate();
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const { uploadAttachment, getAttachmentsByHouseholdId, deleteAttachment, uploadMedicalAssessment } = useAttachments();
  const [uploadedFiles, setUploadedFiles ] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const medicalUploadsInPortal = import.meta.env.VITE_UPLOAD_MEDICAL === 'true';

  const  back = `/foster-application/${applicationPackageId}`


  const breadcrumbItems = [
    { label: 'Become a foster caregiver', path: back },
    { label: 'Providing your medical assessment forms'}
  ];


    const handleUpload = async (uploadData) => {
      try {
        //const lastDotIndex = uploadData.fileName.lastIndexOf('.');
        //const fileExtension = uploadData.fileType.startsWith('.')
        //  ? uploadData.fileType.substring(1)
        //  : uploadData.fileType;
        
        const existingSequences = uploadedFiles.filter(
          file => file.attachmentType === uploadData.attachmentType
        ).map(file => {
          //extract sequence number from filename 
          const match = file.fileName.match(/_(\d{3})\.[^.]+$/);
          return match ? parseInt(match[1], 10) : 0;
        });

        const nextSequence = existingSequences.length > 0 ? Math.max(...existingSequences) + 1 : 1;
        const sequenceNumber = String(nextSequence).padStart(3, '0')
        
        const newFileName = `Medical_Assessment_${sequenceNumber}`;

        //override the filename
        const modifiedUploadData = {
          ...uploadData,
          fileName: newFileName,
        };

        await uploadAttachment(modifiedUploadData);
        loadAttachments();
        
      } catch (error) {
        
        console.error('Upload failed:', error.message);
      }
    };
  
    const handleDeleteAttachment = async (attachmentId) => {
      try {
        await deleteAttachment(attachmentId);
        await loadAttachments();
      } catch (error) {
        console.error('Delete failed:', error.message);
      }
    }
  
    const loadAttachments = async () => {
      try {
        const attachments = await getAttachmentsByHouseholdId(householdMemberId);
        console.info("getting attachments", attachments);
        
        setUploadedFiles(attachments);
      } catch (error) {
        console.error('Failed to load attachments:', error);
      }
    }
  
    React.useEffect(() => {
      if (applicationPackageId) {
        loadAttachments();
      } else {
        console.error("no bueno");
      }
    }, []);

    const handleSubmitMedicalForms = async () => {
      try {
        if(!householdMemberId || !applicationPackageId) {
          console.error('Missing required IDs');
          return;
        }
        
        const result = await uploadMedicalAssessment(applicationPackageId);
        console.log(`Marked ${result.formsUpdated} screening form(s) as attached`);
        navigate(back)
      } catch (error) {
        console.error('Failed to mark form as attached:', error);
      }
    };

  const handleBackClick = (item) => {
    navigate(item.path);
  };

  return (
    <div className="page">
      <div className="page-details">
        <div className="page-details-row-breadcrumb">
          <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} /> 
        </div>

        <div className="page-details-row-small">
          <h1>Providing your medical assessment forms</h1>
        </div>
        <div className="page-details-row">
            <div className="section-description">
                <p>As part of your assessment to become a Foster Caregiver, you must have a Medical Report completed by your Primary Health Care Provider. The report will be used to assess your 
                medical capacity to provide and care for a foster child.</p>

                <p><strong>Step 1</strong>: Download a copy of the <a href="/MCFD_Medical_Report_on_Applicant.pdf" download className="bright">Medical Report on Applicant</a> form.</p>
                <p><strong>Step 2</strong>: Fill out the information in <em>Section 1 Applicant</em>. </p>
                <p><strong>Step 3</strong>: Make an appointment with your Primary Health Care Provider to complete the rest of the form. 
                Ensure that they sign and date the section on page 3. If you do not have a Primary Health Care Provider, 
                book an appointment with an <a href="https://www.healthlinkbc.ca/primary-care/service-type/urgent-and-primary-care-centres" target="_blank" className="bright">Urgent and Primary Care Centre <ExternalLink className="welcome-link-icon"/></a>.</p>
                <p><strong>Step 4</strong>: Have them forward the completed report along to MCFD as per the contact information on the form.</p> 

                {medicalUploadsInPortal && (
                  <>
                
                <Declaration
                  checked={isDeclarationChecked}
                  disabled={uploadedFiles.length === 0}
                  onChange={setIsDeclarationChecked}
                >
                I declare that the information I have submitted has been completed as per the instructions.
                </Declaration>
                <Button
                  variant={isDeclarationChecked ? 'primary' : 'disabled'}
                  disabled={!isDeclarationChecked && !uploadedFiles.length === 0}
                  onClick={handleSubmitMedicalForms}
                  >Submit Medical Assessment Forms</Button>
                  </>
                )}
            </div>
        </div>
 { medicalUploadsInPortal && (
       <div className="page-details-row-small">       
        <div className="page-details-col">          
          <FileUpload
          attachmentType="Medical Assessment"
          onUpload={handleUpload}
          onDelete={handleDeleteAttachment}
          uploadedFiles={uploadedFiles}
          applicationPackageId={applicationPackageId}
          applicationFormId={null}
          householdMemberId={householdMemberId}
          isLocked={false}
          acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png']}
          maxSizeMB={10}
          description="Medical Assessment"
          />   
       </div>
      </div>
)}
       
       </div>
    </div>
  );

};

export default MedicalForms;