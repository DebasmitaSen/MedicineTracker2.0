// frontend/public/service-worker.js

// 1. Listen for incoming push notifications from the backend scheduler
self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.');

  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      console.error('Failed to parse push data:', e);
      payload = { 
        title: 'MedScript Warning Bell', 
        body: 'It is time to take your scheduled medicine.' 
      };
    }
  }

  const title = payload.title || 'Medicine Reminder';
  
  const options = {
    body: payload.body || 'Please check your MedScript dashboard.',
    // Replace these paths with your actual app icon assets inside the public folder
    icon: '/icon-192x192.png', 
    badge: '/badge-72x72.png', 
    
    // Warning vibration pattern (SOS-style: short-short-short-long)
    vibrate: [200, 100, 200, 100, 200, 100, 500], 
    
    // requireInteraction forces the notification to stay on screen until the user dismisses it 
    // (Critical for medical reminders)
    requireInteraction: true, 
    
    data: {
      url: payload.url || '/',
      scheduleId: payload.scheduleId || null,
      medicineName: payload.medicineName || 'Unknown Medicine'
    },
    
    // Interactive action buttons directly on the notification
    actions: [
      {
        action: 'acknowledge',
        title: '✅ I took it',
      },
      {
        action: 'snooze',
        title: '⏰ Snooze (15m)',
      }
    ]
  };

  // Wait until the notification is successfully shown before terminating the event
  event.waitUntil(self.registration.showNotification(title, options));
});

// 2. Handle user interaction with the notification (clicks and button presses)
self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click Received.', event.action);

  const notification = event.notification;
  const action = event.action;
  const data = notification.data;

  // Close the notification immediately upon interaction
  notification.close();

  if (action === 'acknowledge') {
    console.log(`Medicine ${data.medicineName} acknowledged.`);
    // TODO: In production, uncomment the fetch call to update the database via the backend API
    /*
    event.waitUntil(
      fetch('https://your-api.onrender.com/api/v1/reminders/acknowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleId: data.scheduleId, status: 'taken' })
      })
    );
    */
  } else if (action === 'snooze') {
    console.log(`Medicine ${data.medicineName} snoozed.`);
    // TODO: Send request to backend to reschedule this specific reminder by +15 minutes
    /*
    event.waitUntil(
      fetch('https://your-api.onrender.com/api/v1/reminders/snooze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleId: data.scheduleId, snooze_minutes: 15 })
      })
    );
    */
  } else {
    // If the main body of the notification is clicked, open the web app dashboard
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        // Check if a tab is already open with the app
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.includes(data.url) && 'focus' in client) {
            return client.focus(); // Bring the existing tab to the foreground
          }
        }
        // If no tab is open, launch a new window
        if (clients.openWindow) {
          return clients.openWindow(data.url);
        }
      })
    );
  }
});