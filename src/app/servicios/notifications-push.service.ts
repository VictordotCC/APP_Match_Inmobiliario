import { inject, Injectable } from '@angular/core';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
//import { InteractionService } from './interaction.service';
@Injectable({
  providedIn: 'root'
})
export class NotificationsPushService {
  //private interactionService: InteractionService = inject(InteractionService);
  constructor() { }
  init() {
    console.log('Init notifications push service');
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        //this.interactionService.presentAlert('No se ha permitido recibir notificaciones');
        alert('No se ha permitido recibir notificaciones');
      }
    });
    this.addListener();
  }
  private addListener() {
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('registro exitoso My token: ' + JSON.stringify(token));
      alert('Registro existoso, My token: ' + token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));
      alert('Error en el registro: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push received: ' + JSON.stringify(notification));
      //this.interactionService.presentAlert('Push recibido: ' + JSON.stringify(notification));
      alert('Push recibido: ' + JSON.stringify(notification));
    });

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
      //this.interactionService.presentAlert('Notificación en segundo plano: ' + JSON.stringify(notification));
      alert('Notificación en segundo plano: ' + JSON.stringify(notification));
    });
  }
  public sendNotification(title: string, body: string) {
    PushNotifications.createChannel({
      id: 'match-channel',
      name: 'Match Notifications',
      description: 'Notifications for matches',
      importance: 5,
      visibility: 1,
      sound: 'default',
      vibration: true,
    });
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Notification received: ', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Notification action performed: ', notification);
    });

    // Scheduling notifications is not supported by PushNotifications, consider using LocalNotifications instead
    console.log('Notification scheduled: ', { title, body });
    alert(`Notification scheduled: ${title} - ${body}`);
  }

}
