if(typeof emailjs !== "undefined"){

    emailjs.init("tCxDmS-ud4rQ38m_9");

}
/* =========================
   SIGNUP
========================= */

const signupForm =
document.getElementById("signupForm");

if(signupForm){

    signupForm.addEventListener(
    "submit",

    async (e)=>{

        e.preventDefault();

        const name =
        document.getElementById("name").value;

        const email =
        document.getElementById("email").value;

        const password =
        document.getElementById("password").value;

        try{

            const response =
            await fetch(

                "http://localhost:5000/api/auth/signup",

                {

                    method:"POST",

                    headers:{

                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({

                        name,

                        email,

                        password
                    })
                }
            );
            console.log("Response Status:", response.status);
console.log("Response OK:", response.ok);

            const data =
            await response.json();
console.log("Response Data:", data);

            if(response.ok){

                /* SAVE TOKEN */

                localStorage.setItem(

                    "token",

                    data.token
                );

                localStorage.setItem(

                    "user",

                    JSON.stringify(data.user)
                );


                /* SUCCESS MESSAGE */

                alert("✅ Signup Successful! Redirecting to Login...");


                /* CLEAR FORM */

                signupForm.reset();


                /* REDIRECT AFTER 2 SECONDS */

                setTimeout(()=>{

                    window.location.href =
                    "login.html";

                },2000);

            }

            else{

                alert(data.message);
            }

        }

        catch(error){

    console.error("Signup Error:", error);

    alert("❌ Signup Failed: " + error.message);
}
    });
}
/* =========================
   LOGIN
========================= */

const loginForm =
document.getElementById("loginForm");


if(loginForm){

    loginForm.addEventListener(
    "submit",

    async (e)=>{

        e.preventDefault();


        const email =
        document.getElementById("email").value;

        const password =
        document.getElementById("password").value;


        try{

            const response =
            await fetch(

                "http://localhost:5000/api/auth/login",

                {

                    method:"POST",

                    headers:{

                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({

                        email,

                        password
                    })
                }
            );


            const data =
            await response.json();


            alert(data.message);


            if(response.ok){

    localStorage.setItem(
        "token",
        data.token
    );

    localStorage.setItem(
        "user",
        JSON.stringify(data.user)
    );

    window.location.href =
    "dashboard.html";
}

        }

        catch(error){

            console.log(error);

            alert("Login Failed");
        }
    });
}
/* =========================================
   SHOW / HIDE PASSWORD
========================================= */

const togglePassword =
document.getElementById(
    "togglePassword"
);

const passwordField =
document.getElementById(
    "password"
);


if(togglePassword && passwordField){

    togglePassword.addEventListener(

        "click",

        ()=>{

            if(
                passwordField.type ===
                "password"
            ){

                passwordField.type =
                "text";

                togglePassword.innerHTML =
                "🙈";
            }

            else{

                passwordField.type =
                "password";

                togglePassword.innerHTML =
                "👁️";
            }
        }
    );
}