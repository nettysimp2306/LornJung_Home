//import { Notifications } from 'react-native-notifications';
Notifications.registerRemoteNotifications();

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import { Notifications } from 'react-native-notifications';

Notifications.registerRemoteNotifications();

AppRegistry.registerComponent(appName, () => App);

