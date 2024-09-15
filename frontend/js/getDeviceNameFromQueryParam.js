async function getDeviceNameFromQueryParam () {

    // get query parameter from url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const queryDeviceName = urlParams.get('deviceName');

    let deviceName = document.getElementById('deviceName');
    deviceName.value = queryDeviceName;
}

getDeviceNameFromQueryParam();