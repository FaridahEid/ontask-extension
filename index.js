const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function sendForSignature() {

//OnTask Configuration Setup
    let ontaskGroupAPIToken = "ed766a92-8f4c-4172-aecf-19d59a9639a1";
    let apiBaseURL = "https://app.ontask.io/api/v2";
    let ontaskWorkflowID = "9662c717-8d43-4f94-a74a-da16a1095bd6";
    let testEmailAddress = "faridaeid@usf.edu";

 //OnTask Document Upload API Call
    let templateFile = fs.readFileSync(path.join(__dirname, 'APIDemoContract.docx'));

    const documentsResponse = await axios.post(`${apiBaseURL}/documents`,
            templateFile,
            {headers: {'Authorization': ontaskGroupAPIToken, 'Content-Type': 'application/pdf'}})
            .catch(function (error) {
                console.log(error);
            });

 //OnTask fields API Call
    let documentID = await documentsResponse.data.documentId;
    let fieldsConfiguration = { fields: [
            { anchorString: "%SignatureA%", name: "Signature A",height:40,width:180,xOffset:2,yOffset:5,removeAnchorString: true,required: true,type: "signature" },
            { anchorString: "%NameA%", name: "Name",height:12,width:180,xOffset:1,yOffset:5,removeAnchorString: true,required: true,type: "text" },
            { anchorString: "%DateA%", name: "Date",height:12,width:180,xOffset:1,yOffset:5,removeAnchorString: true,required: true,type: "text" },
            { anchorString: "%SignatureB%", name: "Signature B",height:40,width:180,xOffset:2,yOffset:5,removeAnchorString: true,required: true,type: "signature" }
        ]
    }

    const fieldsResponse = await axios.put(`${apiBaseURL}/documents/${documentID}/fields`,
        fieldsConfiguration,
            {headers: {'Authorization': ontaskGroupAPIToken}})
            .catch(function (error) {
                console.log(error);
            });

//OnTask Start Workflow API Call
    let workflowPostBody = { myFile: documentID, recipient_email_address: testEmailAddress}
    const workflowStarResponse = await axios.post(`${apiBaseURL}/workflowTemplates/${ontaskWorkflowID}`,
        workflowPostBody,
        {headers: {'Authorization': ontaskGroupAPIToken}})
        .catch(function (error) {
            // handle error
            console.log(error);
        });

    console.log(workflowStarResponse.data);
}

sendForSignature();
