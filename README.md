### ETERNA Smart Reservation – Akıllı Rezervasyon ve Zaman Yönetim Sistemi

Bu proje, Eterna tarafından belirlenen, gerçek hayatta kullanılabilecek akıllı rezervasyon ve zaman yönetim sistemi geliştirmek amacıyla Node.js ve Express.js yetkinliklerini ölçmek için hazırlanmıştır. 
Sistem, şirket kaynaklarının (toplantı odaları, çalışma masaları, cihazlar vb.) belirli bir tarih ve saat aralığında rezerve edilmesini ve çakışan rezervasyonların engellenmesini sağlar.

------------------------------------------------------------------

## Ölçülen Yetkinlikler

[cite_start]Bu proje ile aşağıdaki teknik yetkinlikler değerlendirilmiştir[cite: 5]:

-Node.js ve Express.js kullanımı [cite: 6]
-RESTful API tasarımı [cite: 7]
-Veritabanı modelleme becerisi [cite: 8]
-Zaman ve Çakışma Yönetimi Algoritması
-Authentication & Authorization (JWT)
-Clean code ve proje mimarisi

------------------------------------------------------------------

## Kullanılan Teknolojiler

-Node.js & Express.js: Sunucu tarafı uygulama çerçevesi.
-MongoDB : MongoDB - Mongoose veritabanı için.
-JWT Authentication: Kullanıcı oturum yönetimi için.
-dotenv: Çevre değişkenlerini yönetmek için.
-Postman: API testleri ve koleksiyonu için.

------------------------------------------------------------------

## Kurulum ve Çalıştırma Adımları

Projenin yerel makinenizde çalıştırılması için aşağıdaki adımları sırasıyla takip edin.

# 1. Ön Gereksinimler

* Node.js (v18+) ve npm kurulu olmalıdır.
* MongoDB veya PostgreSQL servisi yerel makinede veya bulutta erişilebilir olmalıdır.

# 2. Depoyu Klonlama

Terminalde: git clone [https://github.com/cagdaskemaloglu/bookingApp.git](https://github.com/cagdaskemaloglu/bookingApp.git)
cd bookingApp

# 3. Bağımlılıkları Yükleme

npm install

# 4. Çevre Değişkenlerini Ayarlama

Projenin kök dizininde .env adında bir dosya oluşturun ve aşağıdaki gerekli değişkenleri kendi değerlerinizle doldurun:

# Sunucu Portu
PORT=3000
# Veritabanı Bağlantısı
MONGO_URI = mongodb+srv://cagdaskml_db_user:z1tL3pkfgQvC5CyU@cluster0.r9nvaby.mongodb.net/
# JWT Ayarları
JWT_SECRET=cok_gizli_ve_uzun_bir_anahtar

# 5. Uygulamayı Başlatma

Terminalde: npm start


