function enableRegButton()
{
    if (document.getElementById("firstName").value.length === 0 ||
        document.getElementById("regLastName").value.length === 0 ||
        document.getElementById("regEmail").value.length === 0 ||
        document.getElementById("phone").value.length === 0)
    {
        document.getElementById("regBtn").disabled = true;
    }
    else
    {
        document.getElementById("regBtn").disabled = false;
    }
}

function enableLogBtn()
{
    if (document.getElementById("logLastName").value.length === 0 ||
        document.getElementById("logEmail").value.length === 0)
    {
        document.getElementById("logBtn").disabled = true;
    }
    else
    {
        document.getElementById("logBtn").disabled = false;
    }
}

function enablePostBtn()
{
    if (document.getElementById("title").value.length === 0 ||
        document.getElementById("contentInput").value.length === 0)
    {
        document.getElementById("postBtn").disabled = true;
    }
    else
    {
        document.getElementById("postBtn").disabled = false;
    }
}

function displayLogIn()
{
    document.getElementById("logInContainer").style.display = "block";
    document.getElementById("signUpContainer").style.display = "none";
}

function logOut()
{
    location.reload();
}

function displaySignUp()
{
    document.getElementById("logInContainer").style.display = "none";
    document.getElementById("signUpContainer").style.display = "block";
}