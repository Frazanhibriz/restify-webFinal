--
-- PostgreSQL database dump
--

\restrict g9NjyJtw9GSjA5Z3Q1cB00DFUPL8EsaWUYWQBwp4V0N8jTTpuON7p8Jv3lHJlge

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-31 09:08:26

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 28316)
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    room_id bigint NOT NULL,
    check_in_date date NOT NULL,
    check_out_date date NOT NULL,
    nights integer NOT NULL,
    total_price numeric(10,2) NOT NULL,
    guests integer NOT NULL,
    extra_bed boolean DEFAULT false NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    payment_status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    payment_method character varying(255),
    payment_token character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    expired_at timestamp(0) without time zone,
    CONSTRAINT bookings_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'failed'::character varying])::text[]))),
    CONSTRAINT bookings_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying, 'checked_in'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 28315)
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO postgres;

--
-- TOC entry 5158 (class 0 OID 0)
-- Dependencies: 231
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- TOC entry 239 (class 1259 OID 28432)
-- Name: cache; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);


ALTER TABLE public.cache OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 28443)
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);


ALTER TABLE public.cache_locks OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 28280)
-- Name: hotels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hotels (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    address text NOT NULL,
    city character varying(255) NOT NULL,
    latitude numeric(10,7),
    longitude numeric(10,7),
    description text,
    image character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    qris_image character varying(255),
    facilities json
);


ALTER TABLE public.hotels OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 28279)
-- Name: hotels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hotels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hotels_id_seq OWNER TO postgres;

--
-- TOC entry 5159 (class 0 OID 0)
-- Dependencies: 227
-- Name: hotels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hotels_id_seq OWNED BY public.hotels.id;


--
-- TOC entry 220 (class 1259 OID 28219)
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 28218)
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- TOC entry 5160 (class 0 OID 0)
-- Dependencies: 219
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 225 (class 1259 OID 28258)
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 28406)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id bigint NOT NULL,
    booking_id bigint NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_method character varying(255) DEFAULT 'qris'::character varying NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    transaction_code character varying(255) NOT NULL,
    paid_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT payments_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['qris'::character varying, 'cash'::character varying, 'midtrans'::character varying])::text[]))),
    CONSTRAINT payments_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'failed'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 28405)
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- TOC entry 5161 (class 0 OID 0)
-- Dependencies: 237
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- TOC entry 236 (class 1259 OID 28383)
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name text NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.personal_access_tokens OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 28382)
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_access_tokens_id_seq OWNER TO postgres;

--
-- TOC entry 5162 (class 0 OID 0)
-- Dependencies: 235
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- TOC entry 234 (class 1259 OID 28352)
-- Name: ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ratings (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    booking_id bigint NOT NULL,
    hotel_id bigint NOT NULL,
    rating smallint NOT NULL,
    review text,
    image character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.ratings OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 28351)
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ratings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ratings_id_seq OWNER TO postgres;

--
-- TOC entry 5163 (class 0 OID 0)
-- Dependencies: 233
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ratings_id_seq OWNED BY public.ratings.id;


--
-- TOC entry 222 (class 1259 OID 28229)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 28228)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 5164 (class 0 OID 0)
-- Dependencies: 221
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 230 (class 1259 OID 28293)
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    id bigint NOT NULL,
    hotel_id bigint NOT NULL,
    room_type character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    status character varying(255) DEFAULT 'available'::character varying NOT NULL,
    capacity integer DEFAULT 2 NOT NULL,
    description text,
    image character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    facilities json,
    CONSTRAINT rooms_status_check CHECK (((status)::text = ANY ((ARRAY['available'::character varying, 'booked'::character varying, 'maintenance'::character varying])::text[])))
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 28292)
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rooms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rooms_id_seq OWNER TO postgres;

--
-- TOC entry 5165 (class 0 OID 0)
-- Dependencies: 229
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;


--
-- TOC entry 226 (class 1259 OID 28267)
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 28238)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    role_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    hotel_id bigint,
    profile_picture character varying(255),
    phone character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 28237)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5166 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4919 (class 2604 OID 28319)
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- TOC entry 4915 (class 2604 OID 28283)
-- Name: hotels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels ALTER COLUMN id SET DEFAULT nextval('public.hotels_id_seq'::regclass);


--
-- TOC entry 4912 (class 2604 OID 28222)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 4925 (class 2604 OID 28409)
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- TOC entry 4924 (class 2604 OID 28386)
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- TOC entry 4923 (class 2604 OID 28355)
-- Name: ratings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings ALTER COLUMN id SET DEFAULT nextval('public.ratings_id_seq'::regclass);


--
-- TOC entry 4913 (class 2604 OID 28232)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4916 (class 2604 OID 28296)
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);


--
-- TOC entry 4914 (class 2604 OID 28241)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5144 (class 0 OID 28316)
-- Dependencies: 232
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, user_id, room_id, check_in_date, check_out_date, nights, total_price, guests, extra_bed, status, payment_status, payment_method, payment_token, created_at, updated_at, expired_at) FROM stdin;
\.


--
-- TOC entry 5151 (class 0 OID 28432)
-- Dependencies: 239
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cache (key, value, expiration) FROM stdin;
\.


--
-- TOC entry 5152 (class 0 OID 28443)
-- Dependencies: 240
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- TOC entry 5140 (class 0 OID 28280)
-- Dependencies: 228
-- Data for Name: hotels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hotels (id, name, address, city, latitude, longitude, description, image, created_at, updated_at, qris_image, facilities) FROM stdin;
1	Flores Gallery Hotel	Jl. Flores No.7, Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40115	Bandung	-6.9080704	107.6131024	Hotel artistik bintang 3 dengan banyak lukisan, suasana nyaman, dan fasilitas lengkap di pusat Bandung.	hotels/flores-hotel.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	["Wifi","Kolam Renang","Restaurant","Parking Area","Gym"]
2	eL Hotel Bandung	Jl. Merdeka No.2, Braga, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40111	Bandung	-6.9161116	107.6080445	Hotel modern di pusat kota Bandung dengan akses strategis ke kawasan Braga dan pusat perbelanjaan.	hotels/elhotel-bandung.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	["Wifi","Spa","Cafe","Meeting Room","24 Hours Front Desk"]
3	Puteri Gunung Hotel	Jl. Tangkuban Perahu No.10, Lembang, Kabupaten Bandung Barat, Jawa Barat	Bandung	-6.8132010	107.6171020	Hotel bernuansa alam dengan pemandangan pegunungan dan udara sejuk khas Lembang.	hotels/puteri-gunung.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	["Wifi","Kolam Renang","Taman","Restaurant","Area Bermain"]
4	Grand Restify Hotel	Jl. Sudirman No.1, Bandung, Jawa Barat	Bandung	-6.9175000	107.6191000	Hotel bintang lima dengan layanan premium, kamar luas, dan fasilitas lengkap untuk bisnis maupun liburan.	hotels/grand-restify.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	["Wifi","Gym","Spa","Restaurant","Ballroom"]
5	Braga Heritage Hotel	Jl. Braga No.45, Bandung, Jawa Barat	Bandung	-6.9178000	107.6099000	Hotel klasik di kawasan Braga dengan desain heritage dan akses dekat ke tempat wisata sejarah.	hotels/braga-heritage.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	["Wifi","Cafe","Restaurant","Parking Area","Laundry"]
6	Dago Hills Resort	Jl. Dago Atas No.88, Bandung, Jawa Barat	Bandung	-6.8654000	107.6187000	Resort nyaman dengan suasana sejuk khas Dago, cocok untuk keluarga dan wisata akhir pekan.	hotels/dago-hills.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	["Wifi","Kolam Renang","Garden View","Restaurant","Jogging Track"]
7	Lembang View Hotel	Jl. Raya Lembang No.21, Bandung Barat, Jawa Barat	Bandung	-6.8112000	107.6175000	Hotel keluarga dengan pemandangan alam Lembang dan fasilitas ramah anak.	hotels/lembang-view.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	["Wifi","Playground","Restaurant","Parking Area","Breakfast"]
8	Cihampelas Urban Hotel	Jl. Cihampelas No.120, Bandung, Jawa Barat	Bandung	-6.8939000	107.6047000	Hotel urban dekat pusat belanja, kuliner, dan destinasi wisata populer di Bandung.	hotels/cihampelas-urban.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	["Wifi","Cafe","Laundry","Parking Area","24 Hours Front Desk"]
9	Asia Afrika Hotel	Jl. Asia Afrika No.75, Bandung, Jawa Barat	Bandung	-6.9217000	107.6071000	Hotel strategis dekat kawasan wisata sejarah, museum, dan pusat kota Bandung.	hotels/asia-afrika.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	["Wifi","Restaurant","Meeting Room","Parking Area","Room Service"]
10	Setiabudi Garden Hotel	Jl. Setiabudi No.99, Bandung, Jawa Barat	Bandung	-6.8749000	107.5945000	Hotel nyaman dengan taman luas, suasana tenang, dan cocok untuk liburan keluarga.	hotels/setiabudi-garden.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	["Wifi","Garden","Restaurant","Parking Area","Breakfast"]
11	Menteng City Hotel	Jl. HOS Cokroaminoto No.45, Menteng, Jakarta Pusat, DKI Jakarta	Jakarta	-6.1955000	106.8326000	Hotel bisnis di kawasan Menteng dengan akses mudah ke pusat perkantoran dan area kuliner.	hotels/menteng-city.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	["Wifi","Restaurant","Meeting Room","Parking Area","Room Service"]
12	Sudirman Executive Hotel	Jl. Jenderal Sudirman No.10, Jakarta Pusat, DKI Jakarta	Jakarta	-6.2146000	106.8219000	Hotel eksekutif di kawasan bisnis Sudirman dengan fasilitas modern untuk perjalanan bisnis.	hotels/sudirman-executive.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	["Wifi","Gym","Business Center","Restaurant","Meeting Room"]
13	Kemang Boutique Hotel	Jl. Kemang Raya No.25, Jakarta Selatan, DKI Jakarta	Jakarta	-6.2607000	106.8149000	Hotel boutique dengan desain modern dan suasana santai di kawasan Kemang.	hotels/kemang-boutique.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	["Wifi","Cafe","Swimming Pool","Restaurant","Laundry"]
14	Ancol Seaside Hotel	Jl. Lodan Timur No.7, Ancol, Jakarta Utara, DKI Jakarta	Jakarta	-6.1223000	106.8367000	Hotel dekat kawasan wisata Ancol dengan suasana tepi laut dan fasilitas keluarga.	hotels/ancol-seaside.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	["Wifi","Sea View","Swimming Pool","Restaurant","Kids Area"]
15	Kuningan Grand Hotel	Jl. HR Rasuna Said No.88, Kuningan, Jakarta Selatan, DKI Jakarta	Jakarta	-6.2239000	106.8329000	Hotel premium di kawasan Kuningan dengan fasilitas lengkap untuk bisnis dan liburan.	hotels/kuningan-grand.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	["Wifi","Spa","Gym","Restaurant","Ballroom"]
\.


--
-- TOC entry 5132 (class 0 OID 28219)
-- Dependencies: 220
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_roles_table	1
2	2026_03_05_035754_create_users_table	1
3	2026_03_05_035755_create_hotels_table	1
4	2026_03_05_035756_create_rooms_table	1
5	2026_03_05_035757_create_bookings_table	1
6	2026_03_05_035758_create_ratings_table	1
7	2026_03_05_114400_create_personal_access_tokens_table	1
8	2026_03_06_225856_add_hotel_id_to_users_table	1
9	2026_04_13_053636_create_payments_table	1
10	2026_04_18_002720_create_cache_table	1
11	2026_04_27_031848_add_qris_image_to_hotels_table	1
12	2026_05_02_071205_update_booking_status	1
13	2026_05_08_160506_update_payment_method_enum	1
14	2026_05_08_230321_add_expired_at_to_bookings_table	1
15	2026_05_22_024141_add_profile_picture_to_users_table	1
16	2026_05_22_161831_add_facilities_to_hotels_table	1
17	2026_05_22_162045_add_facilities_to_rooms_table	1
18	2026_05_29_025012_add_phone_to_users_table	1
\.


--
-- TOC entry 5137 (class 0 OID 28258)
-- Dependencies: 225
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- TOC entry 5150 (class 0 OID 28406)
-- Dependencies: 238
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, booking_id, amount, payment_method, status, transaction_code, paid_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5148 (class 0 OID 28383)
-- Dependencies: 236
-- Data for Name: personal_access_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personal_access_tokens (id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5146 (class 0 OID 28352)
-- Dependencies: 234
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ratings (id, user_id, booking_id, hotel_id, rating, review, image, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5134 (class 0 OID 28229)
-- Dependencies: 222
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, created_at, updated_at) FROM stdin;
1	admin	2026-05-31 01:43:29	2026-05-31 01:43:29
2	user	2026-05-31 01:43:29	2026-05-31 01:43:29
3	receptionist	2026-05-31 01:43:29	2026-05-31 01:43:29
\.


--
-- TOC entry 5142 (class 0 OID 28293)
-- Dependencies: 230
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (id, hotel_id, room_type, price, status, capacity, description, image, created_at, updated_at, facilities) FROM stdin;
1	1	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
2	1	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
3	1	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
4	1	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
5	2	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
6	2	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
7	2	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
8	2	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
9	3	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
10	3	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
11	3	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
12	3	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
13	4	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
14	4	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
15	4	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
16	4	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
17	5	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
18	5	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
19	5	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
20	5	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
21	6	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
22	6	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
23	6	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
24	6	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
25	7	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
26	7	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
27	7	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
28	7	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
29	8	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
30	8	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
31	8	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
32	8	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
33	9	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
34	9	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
35	9	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
36	9	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
37	10	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
38	10	Deluxe Room	750000.00	available	2	Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Hot Water","Breakfast"]
39	10	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
40	10	Superior Room	950000.00	available	3	Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.	rooms/superior-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub"]
41	11	Standard Room	650000.00	available	2	Kamar standard yang nyaman untuk tamu bisnis maupun wisatawan dengan fasilitas dasar lengkap.	rooms/standard-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","TV","Hot Water"]
42	11	Deluxe Room	900000.00	available	2	Kamar deluxe modern dengan fasilitas lebih lengkap dan suasana nyaman di pusat kota.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Breakfast","Work Desk"]
43	11	Executive Room	1250000.00	available	3	Kamar executive dengan fasilitas premium untuk kebutuhan bisnis dan pengalaman menginap yang lebih eksklusif.	rooms/executive-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub","City View"]
44	12	Standard Room	650000.00	available	2	Kamar standard yang nyaman untuk tamu bisnis maupun wisatawan dengan fasilitas dasar lengkap.	rooms/standard-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","TV","Hot Water"]
45	12	Deluxe Room	900000.00	available	2	Kamar deluxe modern dengan fasilitas lebih lengkap dan suasana nyaman di pusat kota.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Breakfast","Work Desk"]
46	12	Executive Room	1250000.00	available	3	Kamar executive dengan fasilitas premium untuk kebutuhan bisnis dan pengalaman menginap yang lebih eksklusif.	rooms/executive-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub","City View"]
47	13	Standard Room	650000.00	available	2	Kamar standard yang nyaman untuk tamu bisnis maupun wisatawan dengan fasilitas dasar lengkap.	rooms/standard-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","TV","Hot Water"]
48	13	Deluxe Room	900000.00	available	2	Kamar deluxe modern dengan fasilitas lebih lengkap dan suasana nyaman di pusat kota.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Breakfast","Work Desk"]
49	13	Executive Room	1250000.00	available	3	Kamar executive dengan fasilitas premium untuk kebutuhan bisnis dan pengalaman menginap yang lebih eksklusif.	rooms/executive-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub","City View"]
50	14	Standard Room	650000.00	available	2	Kamar standard yang nyaman untuk tamu bisnis maupun wisatawan dengan fasilitas dasar lengkap.	rooms/standard-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","TV","Hot Water"]
51	14	Deluxe Room	900000.00	available	2	Kamar deluxe modern dengan fasilitas lebih lengkap dan suasana nyaman di pusat kota.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Breakfast","Work Desk"]
52	14	Executive Room	1250000.00	available	3	Kamar executive dengan fasilitas premium untuk kebutuhan bisnis dan pengalaman menginap yang lebih eksklusif.	rooms/executive-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub","City View"]
53	15	Standard Room	650000.00	available	2	Kamar standard yang nyaman untuk tamu bisnis maupun wisatawan dengan fasilitas dasar lengkap.	rooms/standard-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","TV","Hot Water"]
54	15	Deluxe Room	900000.00	available	2	Kamar deluxe modern dengan fasilitas lebih lengkap dan suasana nyaman di pusat kota.	rooms/deluxe-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Smart TV","Breakfast","Work Desk"]
55	15	Executive Room	1250000.00	available	3	Kamar executive dengan fasilitas premium untuk kebutuhan bisnis dan pengalaman menginap yang lebih eksklusif.	rooms/executive-room.jpg	2026-05-31 01:43:29	2026-05-31 01:43:29	["AC","Wifi","Netflix TV","Mini Bar","Bathtub","City View"]
\.


--
-- TOC entry 5138 (class 0 OID 28267)
-- Dependencies: 226
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
\.


--
-- TOC entry 5136 (class 0 OID 28238)
-- Dependencies: 224
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, role_id, name, email, email_verified_at, password, remember_token, created_at, updated_at, hotel_id, profile_picture, phone) FROM stdin;
1	1	Admin Restify	admin@restify.com	\N	$2y$12$/ClOTQGG.YxjMIdLgvyx3ecbAgEYj5pcHpLd8DnTTVJthGT24CWIy	\N	2026-05-31 01:43:29	2026-05-31 01:43:29	\N	\N	\N
2	3	Receptionist Flores Gallery	receptionist.flores@gmail.com	\N	$2y$12$hwRxbG00g5.7T.5RXacAbuhqB/DY4I3aSQH.abVQ8edw96dbV/Boe	\N	2026-05-31 01:43:30	2026-05-31 01:43:30	1	\N	\N
3	3	Receptionist eL Hotel	receptionist.elhotel@gmail.com	\N	$2y$12$7DsfYaW7WPg.qibZMeVpuejmjVeCCqss7EHzhU.fZG8LLw7WmGhES	\N	2026-05-31 01:43:30	2026-05-31 01:43:30	2	\N	\N
4	3	Receptionist Puteri Gunung	receptionist.puterigunung@gmail.com	\N	$2y$12$nouQDVoEIwW0v3gu5DHLJez69y1DWKuPrujRMShroIVRvvM6Wpcb2	\N	2026-05-31 01:43:30	2026-05-31 01:43:30	3	\N	\N
5	3	Receptionist Grand Restify	receptionist.grandrestify@gmail.com	\N	$2y$12$YmK.GDTtb/WL9DKmLhhKZOGIA9lHyba6aBxJoe3buJM1G6i/7mjbO	\N	2026-05-31 01:43:30	2026-05-31 01:43:30	4	\N	\N
6	3	Receptionist Braga Heritage	receptionist.braga@gmail.com	\N	$2y$12$gt1CKaR3rZ7/004u0DF2I.fZQuUyVLMZUTr1Epm68hPzryGHuqo1u	\N	2026-05-31 01:43:30	2026-05-31 01:43:30	5	\N	\N
7	3	Receptionist Dago Hills	receptionist.dagohills@gmail.com	\N	$2y$12$fSGJRbI/Jl5w7tzz0jGgEecocCVqhB2/hfcMuE0mwfDbVWeNywSxO	\N	2026-05-31 01:43:31	2026-05-31 01:43:31	6	\N	\N
8	3	Receptionist Lembang View	receptionist.lembangview@gmail.com	\N	$2y$12$vtwVB5doFMZWlFiiinV1IOHq0G3lNe3FB2f4cPzlQCY7z/1119TVa	\N	2026-05-31 01:43:31	2026-05-31 01:43:31	7	\N	\N
9	3	Receptionist Cihampelas Urban	receptionist.cihampelas@gmail.com	\N	$2y$12$7umfgJcGeK/Gm7lGGCsxweB.YkMWVGQB8GgceGRFg26hKvss58evq	\N	2026-05-31 01:43:31	2026-05-31 01:43:31	8	\N	\N
10	3	Receptionist Asia Afrika	receptionist.asiaafrika@gmail.com	\N	$2y$12$m9lj/tHE45MyQoLkDbgKIeweay5XWKAM0cfm8zkdxLAYRUXSWEglu	\N	2026-05-31 01:43:31	2026-05-31 01:43:31	9	\N	\N
11	3	Receptionist Setiabudi Garden	receptionist.setiabudi@gmail.com	\N	$2y$12$AR2kQxkhTeucaSbDHcqkwOnhpApop7sMgOvpFkyBXiz1fL5ii1xcG	\N	2026-05-31 01:43:31	2026-05-31 01:43:31	10	\N	\N
12	3	Receptionist Menteng City	receptionist.mentengcity@gmail.com	\N	$2y$12$MODBEmL79DWb1Qh4gKq4qe0Uhv7CSmH4DinmiwNnkaZU0q8wfzBXi	\N	2026-05-31 01:43:32	2026-05-31 01:43:32	11	\N	\N
13	3	Receptionist Sudirman Executive	receptionist.sudirman@gmail.com	\N	$2y$12$7DG2ZfvVCF6PE4UeLPu5b.RbtLCs24bwpgVFMTktRSg2jPKs6I1CG	\N	2026-05-31 01:43:32	2026-05-31 01:43:32	12	\N	\N
14	3	Receptionist Kemang Boutique	receptionist.kemang@gmail.com	\N	$2y$12$jhDvkEXSxY5.gQm/IzDFP.1asIHQcvvEkzxq5NrOlrXxjTR7l8O2i	\N	2026-05-31 01:43:32	2026-05-31 01:43:32	13	\N	\N
15	3	Receptionist Ancol Seaside	receptionist.ancol@gmail.com	\N	$2y$12$eWAsUBa5L1.K7XJbWKPGc.dEqRmSp8Xm9KDrutw5D4y.zmzo6OmEO	\N	2026-05-31 01:43:32	2026-05-31 01:43:32	14	\N	\N
16	3	Receptionist Kuningan Grand	receptionist.kuningan@gmail.com	\N	$2y$12$T8ABcu4GNr8k.2guzSnEvuV7vodFPYgESFmCZtNiTqVIoiLuS9oci	\N	2026-05-31 01:43:32	2026-05-31 01:43:32	15	\N	\N
\.


--
-- TOC entry 5167 (class 0 OID 0)
-- Dependencies: 231
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_id_seq', 1, false);


--
-- TOC entry 5168 (class 0 OID 0)
-- Dependencies: 227
-- Name: hotels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hotels_id_seq', 15, true);


--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 219
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 18, true);


--
-- TOC entry 5170 (class 0 OID 0)
-- Dependencies: 237
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- TOC entry 5171 (class 0 OID 0)
-- Dependencies: 235
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 1, false);


--
-- TOC entry 5172 (class 0 OID 0)
-- Dependencies: 233
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ratings_id_seq', 1, false);


--
-- TOC entry 5173 (class 0 OID 0)
-- Dependencies: 221
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- TOC entry 5174 (class 0 OID 0)
-- Dependencies: 229
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rooms_id_seq', 55, true);


--
-- TOC entry 5175 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 16, true);


--
-- TOC entry 4952 (class 2606 OID 28339)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- TOC entry 4974 (class 2606 OID 28452)
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- TOC entry 4971 (class 2606 OID 28441)
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- TOC entry 4948 (class 2606 OID 28291)
-- Name: hotels hotels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels
    ADD CONSTRAINT hotels_pkey PRIMARY KEY (id);


--
-- TOC entry 4934 (class 2606 OID 28227)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4942 (class 2606 OID 28266)
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- TOC entry 4966 (class 2606 OID 28423)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4968 (class 2606 OID 28431)
-- Name: payments payments_transaction_code_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_code_unique UNIQUE (transaction_code);


--
-- TOC entry 4960 (class 2606 OID 28395)
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4962 (class 2606 OID 28398)
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- TOC entry 4955 (class 2606 OID 28381)
-- Name: ratings ratings_booking_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_booking_id_unique UNIQUE (booking_id);


--
-- TOC entry 4957 (class 2606 OID 28364)
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- TOC entry 4936 (class 2606 OID 28236)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4950 (class 2606 OID 28309)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- TOC entry 4945 (class 2606 OID 28276)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4938 (class 2606 OID 28257)
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- TOC entry 4940 (class 2606 OID 28250)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4953 (class 1259 OID 28350)
-- Name: bookings_user_id_room_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bookings_user_id_room_id_index ON public.bookings USING btree (user_id, room_id);


--
-- TOC entry 4969 (class 1259 OID 28442)
-- Name: cache_expiration_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cache_expiration_index ON public.cache USING btree (expiration);


--
-- TOC entry 4972 (class 1259 OID 28453)
-- Name: cache_locks_expiration_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cache_locks_expiration_index ON public.cache_locks USING btree (expiration);


--
-- TOC entry 4964 (class 1259 OID 28429)
-- Name: payments_booking_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_booking_id_index ON public.payments USING btree (booking_id);


--
-- TOC entry 4958 (class 1259 OID 28399)
-- Name: personal_access_tokens_expires_at_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX personal_access_tokens_expires_at_index ON public.personal_access_tokens USING btree (expires_at);


--
-- TOC entry 4963 (class 1259 OID 28396)
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- TOC entry 4943 (class 1259 OID 28278)
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- TOC entry 4946 (class 1259 OID 28277)
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- TOC entry 4978 (class 2606 OID 28345)
-- Name: bookings bookings_room_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_room_id_foreign FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- TOC entry 4979 (class 2606 OID 28340)
-- Name: bookings bookings_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4983 (class 2606 OID 28424)
-- Name: payments payments_booking_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_foreign FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- TOC entry 4980 (class 2606 OID 28370)
-- Name: ratings ratings_booking_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_booking_id_foreign FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- TOC entry 4981 (class 2606 OID 28375)
-- Name: ratings ratings_hotel_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_hotel_id_foreign FOREIGN KEY (hotel_id) REFERENCES public.hotels(id) ON DELETE CASCADE;


--
-- TOC entry 4982 (class 2606 OID 28365)
-- Name: ratings ratings_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4977 (class 2606 OID 28310)
-- Name: rooms rooms_hotel_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_hotel_id_foreign FOREIGN KEY (hotel_id) REFERENCES public.hotels(id) ON DELETE CASCADE;


--
-- TOC entry 4975 (class 2606 OID 28400)
-- Name: users users_hotel_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_hotel_id_foreign FOREIGN KEY (hotel_id) REFERENCES public.hotels(id) ON DELETE SET NULL;


--
-- TOC entry 4976 (class 2606 OID 28251)
-- Name: users users_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


-- Completed on 2026-05-31 09:08:27

--
-- PostgreSQL database dump complete
--

\unrestrict g9NjyJtw9GSjA5Z3Q1cB00DFUPL8EsaWUYWQBwp4V0N8jTTpuON7p8Jv3lHJlge

