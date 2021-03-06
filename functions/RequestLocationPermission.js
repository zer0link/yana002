import { PermissionsAndroid } from 'react-native';

export async function RequestLocationPermission() 
{
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Example App',
        'message': 'Example App access to your location '
      }
    )
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.warn("location permission denied")
      alert("Location permission denied");
    }
  } catch (err) {
    console.warn(err)
  }
};