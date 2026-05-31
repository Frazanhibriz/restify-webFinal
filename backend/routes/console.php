<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('bookings:cancel-expired')
    ->everyMinute();