## LandingpageRequestAPI


## Staging 
curl -X POST https://europe-west3-mrcleanerstaging.cloudfunctions.net/landingpageRequestAPI \
  -H "Content-Type: application/json" \
  -d '{"secret":"QkGgZ120P6j3okWPX3auMCSh"}'
  
Reminder:
Please make sure the Secret can not be found in the Body or JS on Web
Use ENV-Variable to separate staging and production not found on Github/Bitbucket

**Production Key** will be send on another communication channel



## Structure:

!!! Please make sure optional is optional and not emty String!
!!! Everthing signed NOT optional is needed to prevent Error in follow-up functions

```ts
export enum FurnitureType {
    FURNISHED = "furnished",
    PARTLY_FURNISHED = "partly_furnished",
    UNFURNISHED = "unfurnished",
}

export enum PollutionLevel {
    EASY = "easy",
    NORMAL = "normal",
    STRONG = "strong",
    EXTREME = "extreme",
}

export enum ObjectType {
    HOUSE = "house",
    APARTMENT = "apartment",
    OFFICE = "office",
    PRACTICE = "practice",
    STORE = "store",
    RESTAURANT = "restaurant",
}

export interface ObjectDetails {
    floor: string,
    furnitureType: FurnitureType,
    objectType: ObjectType,
}
export interface LandingpageRequest { // no ID. Will be add my firebase
    address: BillingAddress;
    locationAddress?: CleaningAddress;
    contact?: ContactPerson;
    coupon?: string;
    dates?: string[];
    cat: LandingpageCat[];
    objectDetails: ObjectDetails,
    franchise: string;
    tagManagerGCLID?: string, 
    tagManagerCLIEND?:string,
    tagManagerSESSIONID?:string,
    device?:Device,
    timeFormSent?:string,
    createdBy: string 
    createdByDisplayName: string;
}


export interface LandingpageCat {
    id: string;
    pollutionLevel: PollutionLevel | "";
    cleaningWishes?: string[];
    description?: string;
    images?: string[];
    catImages?: string[];
    // General cleaning and Window cleaning
    cleaningReason?: string;
    cleaningAreaQm?: string;
    furnitureType?: FurnitureType | "";
    objectType?: ObjectType | "";
    // Used in Window cleaning
    casementsNumber?: string;
    maxRoomHeight?: string;
    // Used in Carpet cleaning
    looseCarpetNumber?: string;
    looseCarpetTotalSurface?: number | null;
    fixedCarpetTotalSurface?: number | null;
    // Used in Upholstery cleaning
    seater2?: string;
    seater3?: string;
    cornerCouchSmall?: string;
    cornerCouchLarge?: string;
    armchair?: string;
    stool?: string;
    upholsteredChairWithBack?: string;
    upholsteredChairWithoutBack?: string;
    couchIndividual?: string;
    quantity?: string;
    subQuantity?: string;
}

export interface BillingAddress {
    company?: string;
    salutation: Salutation;
    title?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    street: string;
    number: string;
    zip: string;
    city: string;
    taxId?: string;
    country: Country;
}

export interface CleaningAddress {
    company?: string;
    street: string;
    number: string;
    zip: string;
    city: string;
    country: Country;
}

export interface ContactPerson {
    salutation: Salutation;
    title?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    info?: string;
}
export enum Salutation {
    mr = "mr",
    ms = "ms",
}
export enum Country {
    CH = "CH",
    DE = "DE",
    AT = "AT",
    US = "US",
}
```

## Example Messi:

```json



{
	"dates": [
		"2025-12-18",
		"2025-12-19",
		"2025-12-20"
	],
	"cat": [
		{
			"cleaningReason": "messie_apartment", // should be fix on your side (for now)
			"cleaningAreaQm": "233", 
			"pollutionLevel": "extrem",
			"cleaningWishes": [
				"Küche",
				"Desinfektion",
				"Möbel/Flächen",
				"Fäkalien"
			],
			"description": "a lot of newspaper and books",
			"images": [
				"https://staging.mrcleaner.de/leadform-images/xmhPEkmTd0xJFdxWevPT.jpg", 
				"https://staging.mrcleaner.de/leadform-images/rMJiHGplyihn2U45U0l7.jpg"
			], 
			// the pictures should be hold temporaly and can be deleted on your side the day after
			"id": "204" // should be fix on your side at this time
		}
	],
	"address": {
		"salutation": "mr",
		"title": "Dr.", // possible not needed
		"firstName": "Michael",
		"lastName": "Schefter",
		"street": "Gartenstraße",
		"number": "7",
		"zip": "10115",
		"city": "Berlin",
		"email": "tropolis@me.com", // a littel email string check before sending is always a good Idea
		"phone": "+41797131078", // also here
		"country": "DE"
	},
	"franchise": "DACH", // predefined
	"createdBy": "WEB-HELP", // predefined
	"createdByDisplayName": "https://staging.mrcleaner.de", // the url it comes from
	"tagManagerGCLID": "", // very important for this project
	"tagManagerCLIEND": "GA1.1.309723331.1765780673", // very important for this project
	"tagManagerSESSIONID": "", // very important for this project
	"device": {
		"deviceType": "desktop",
		"deviceOS": "Mac", 
		"deviceModel": "Apple "
	},
	"timeFormSent": "457", // count of time to fill the formular 
	"objectDetails": {
		"objectType": "apartment",
		"floor": "5 Obergeschoss",
		"furnitureType": "furnished"
	},
	"locationAddress": {
		"company": "Hazu AG", // may not be in the form
		"street": "Gartenstraße",
		"number": "12",
		"zip": "10115",
		"city": "Berlin",
		"country": "DE"
	},
	"contact": {
		"salutation": "ms",
		"title": "Prof.",
		"firstName": "Susi",
		"lastName": "Qadro",
		"email": "tropolis@me.com",
		"phone": "+41797131078",
		"info": "the Bell is on the Top"
	},
	"created": {
		"_seconds": 1765944906,
		"_nanoseconds": 964000000
	}, // use a normal Date or Timestamp Object !!, Firebase does the _seconds and _nanoseconds constract during writing
	"updatedAt": {
		"_seconds": 1765944906,
		"_nanoseconds": 964000000
	}// same timestamp, we need the updatedAt for later purpose
}
```
