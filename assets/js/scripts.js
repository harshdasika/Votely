
gapi.load('auth2', function() {
    auth2 = gapi.auth2.init({
        client_id: '988826026614-nqfgqj8h6rcm5ot7us9dcomoq8fuksko.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
    });
    attachSignin(document.getElementById('customBtn'));
});

// Attach sign-in functionality to login button
function attachSignin(element) {
    auth2.attachClickHandler(element, {},
        function(googleUser) {
            // Get profile information
            var profile = googleUser.getBasicProfile();
            console.log("ID: " + profile.getId());
            console.log("Name: " + profile.getName());
            console.log("Email: " + profile.getEmail());

            // Get ID token to authenticate with backend
            var id_token = googleUser.getAuthResponse().id_token;

            // Send token to server for further authentication
            fetch('/api/auth/google-signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: id_token })
            }).then(response => {
                if (response.ok) {
                    // Redirect to the dashboard after successful login
                    window.location.href = "/dashboard";
                } else {
                    alert('Failed to authenticate');
                }
            }).catch(error => {
                console.error('Error during Google Sign-In:', error);
            });
        },
        function(error) {
            console.error('Google Sign-In error:', error);
        }
    );
}
