const { reservationEventEmitter, EVENTS } = require('./eventEmitter');

function initializeNotificationService() {
    console.log('Bildirim servisi başlatıldı. Olaylar dinleniyor...');

    //rez oluşturuldu
    reservationEventEmitter.on(EVENTS.RESERVATION_CREATED, (reservationDetails) => {
        console.log('----------------------------------------------------');
        console.log(`BİLDİRİM :  YENİ REZERVASYON OLUŞTURULDU:`);
        //console.log(`Kaynak: ${reservationDetails.resourceName}`);
        console.log(`Kullanıcı: ${reservationDetails.userName} (${reservationDetails.userEmail})`);
        console.log(`Tarih: ${new Date(reservationDetails.startTime).toLocaleString()} - ${new Date(reservationDetails.endTime).toLocaleString()}`);
        console.log('----------------------------------------------------');
    });

    //rezervasyon iptali
    reservationEventEmitter.on(EVENTS.RESERVATION_CANCELLED, (reservationDetails) => {
        console.log('----------------------------------------------------');
        console.log(`BİLDİRİM : REZERVASYON İPTAL EDİLDİ:`);
        console.log(`Rezervasyon ID: ${reservationDetails._id}`);
        console.log(`İptal Eden Kullanıcı: ${reservationDetails.userName}`);
        console.log('----------------------------------------------------');
    });
}

module.exports = { initializeNotificationService };