<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ReceptionistController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\UserController;


Route::post('/register', [AuthController::class,'register'])->middleware('throttle:register');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');


Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:forgot-password');
Route::post('/reset-password', [AuthController::class, 'resetPassword']);


Route::get('/hotels', [HotelController::class,'index']);
Route::get('/hotels/{id}', [HotelController::class,'show']);
Route::get('/hotels/{id}/ratings', [RatingController::class,'hotelRatings']);
Route::get('/hotels/{id}/rooms', [RoomController::class,'roomsByHotel']);


Route::post('/midtrans/callback', [BookingController::class, 'midtransCallback']);



Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class,'logout']);
    Route::get('/profile', [AuthController::class,'profile']);
    Route::get('/booking/{id}', [BookingController::class,'show']);
});



Route::middleware(['auth:sanctum','role:admin'])
    ->prefix('admin')
    ->group(function () {

    Route::apiResource('hotels', HotelController::class);
    Route::apiResource('rooms', RoomController::class);
    Route::apiResource('users', UserController::class);
    Route::get('/bookings', [BookingController::class,'allBookings']);
});



Route::middleware(['auth:sanctum','role:user'])
    ->prefix('user')
    ->group(function () {

    Route::post('/booking', [BookingController::class,'store']);
    Route::post('/cancel-booking/{id}', [BookingController::class, 'cancel']);
    Route::get('/booking-history', [BookingController::class,'history']);
    Route::get('/payment/{id}', [BookingController::class,'paymentDetail']);
    Route::post('/pay/{id}', [BookingController::class,'pay']);

    Route::post('/ratings', [RatingController::class,'store']);
    Route::post('/upload-profile', [AuthController::class, 'uploadProfile']);
    Route::post('/update-profile', [AuthController::class, 'updateProfile']);
}); 



Route::middleware(['auth:sanctum','role:receptionist'])
    ->prefix('receptionist')
    ->group(function () {

    Route::get('/bookings', [ReceptionistController::class,'bookingList']);
    Route::post('/confirm-booking', [ReceptionistController::class,'confirm']);
    Route::post('/check-in', [ReceptionistController::class,'checkIn']);
    Route::post('/decline-booking', [ReceptionistController::class,'decline']);
    Route::post('/update-room-status', [ReceptionistController::class,'updateRoomStatus']);
    Route::post('/check-out', [ReceptionistController::class,'checkOut']);
});