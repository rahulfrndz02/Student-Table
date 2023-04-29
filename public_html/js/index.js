
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var studentDBName = "SCHOOL-DB";
var studentRelationName = "STUDENT-TABLE";
var connToken = "90933240|-31949278380858993|90950873";

$("#studentRoll").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

//function for validation
function validateData() {
    //validating employee id, name and email
    var studentRollVar, studentNameVar, studentClassVar, studentBirthDateVar, studentAddressVar, studentEnrollDateVar;
    studentRollVar = $("#studentRoll").val(); //Jquery syntax
    if (studentRollVar === "") {
        alert("Student Roll Number Missing");
        $("#studentRoll").focus(); //after adding data cursor move to employee id
        return "";
    }

    studentNameVar = $("#studentName").val();
    if (studentNameVar === "") {
        alert("Student Name is Missing");
        $("#studentName").focus();
        return "";
    }

    studentClassVar = $("#studentClass").val();
    if (studentClassVar === "") {
        alert("Student Class is Missing");
        $("#studentClass").focus();
        return "";
    }
    studentBirthDateVar = $("#studentBirthDate").val();
    if (studentBirthDateVar === "") {
        alert("Student Birth-Date is Missing");
        $("#studentBirthDate").focus();
        return "";
    }
    studentAddressVar = $("#studentAddress").val();
    if (studentAddressVar === "") {
        alert("Student Address is Missing");
        $("#studentAddress").focus();
        return "";
    }
    studentEnrollDateVar = $("#studentEnrollDate").val();
    if (studentEnrollDateVar === "") {
        alert("Student Enroll-Date is Missing");
        $("#studentEnrollDate").focus();
        return "";
    }

    //if all the data is valid creating jason object in js
    var jsonStrObj = {
        studentRoll: studentRollVar,
        studentName: studentNameVar,
        studentClass: studentClassVar,
        studentBirthDate: studentBirthDateVar,
        studentAddress: studentAddressVar,
        studentEnrollDate: studentEnrollDateVar
    };
    return JSON.stringify(jsonStrObj);
}



function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#studentRoll").val(record.studentRoll);
    $("#studentName").val(record.studentName);
    $("#studentClass").val(record.studentClass);
    $("#studentBirthDate").val(record.studentBirthDate);
    $("#studentAddress").val(record.studentAddress);
    $("#studentEnrollDate").val(record.studentEnrollDate);
}

//function for clearing the form
function resetForm() {
    //making all value empty
    $("#studentRoll").val("");
    $("#studentName").val("");
    $("#studentClass").val("");
    $("#studentBirthDate").val("");
    $("#studentAddress").val("");
    $("#studentEnrollDate").val("");
    $("#studentRoll").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);

    $("#studentRoll").focus(); //put cursor back to empId
}

//function for saving employee data
function saveData() {
    //validate form data
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }

    //create JPDB request string - token, dbname, rel name.......
    var putRequest = createPUTRequest(connToken, jsonStrObj, studentDBName, studentRelationName);
    jQuery.ajaxSetup({async: false}); //just like multithreading, controlling the multithreading of Ajax
    //execute this request
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML); //coming from js

    jQuery.ajaxSetup({async: true});
    //reset the form data
    resetForm();
    $("#studentRoll").focus();
}


function changeData() {
    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studentDBName, studentRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#studentRoll").focus();
}


function getStudent() {
    var studentRollJsonObj = getStudentRollAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, studentDBName, studentRelationName, studentRollJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#studentName").focus();
    } else if (resJsonObj.status === 200) {
        $("#studentRoll").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#studentName").focus();

    }
}
function getStudentRollAsJsonObj() {
    var studentRoll = $("#studentRoll").val();
    var jsonStr = {
        id: studentRoll
    };
    return JSON.stringify(jsonStr);
}
