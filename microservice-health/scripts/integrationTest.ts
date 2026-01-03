import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HEALTH_URL = 'http://localhost:5001/api';
const LOGISTICS_URL = 'http://localhost:5002/api';

// Utility to pause execution
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Randomizer for unique usernames
const rand = Math.floor(Math.random() * 10000);

// State Holders
let providerBandungToken = '';
let providerBandungId = '';
let providerJakartaToken = '';
let providerJakartaId = '';

let posyanduToken = '';

let driver1Id = '';
let driver2Id = '';

const SKU_MILK = 'MILK-001';

async function runTest() {
    console.log(`🚀 Starting Comprehensive SiGizi Integration Test (Run ID: ${rand})...`);
    console.log('===============================================================');

    try {
        await phase1_LogisticsSetup_MultiRegion();
        await phase2_HealthSetup_And_AssignmentCheck();
        await phase3_Scenario_StandardFlow();
        await phase4_Scenario_InsufficientStock();
        await phase5_Scenario_DriverBusy();
        
        console.log('\n===============================================================');
        console.log('🎉 ALL SCENARIOS PASSED SUCCESSFULLY!');
        console.log('===============================================================');

    } catch (error: any) {
        console.error('\n❌ TEST FAILED!');
        console.error(error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
            console.error('Status:', error.response.status);
        }
        process.exit(1);
    }
}

// ============================================================================ 
// PHASE 1: LOGISTICS SETUP (MULTI-REGION FOR GMAPS TESTING)
// ============================================================================ 
async function phase1_LogisticsSetup_MultiRegion() {
    console.log('\n📦 [PHASE 1] Logistics Setup: Multi-Region (Testing Geocoding)');
    
    // --- 1. Register Provider A (BANDUNG - Gedung Sate) ---
    // Using ADDRESS ONLY to force Geocoding
    const credsBdg = {
        username: `prov_bdg_${rand}`,
        password: 'password123',
        name: `Gudang Bandung ${rand}`,
        address: 'Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat' 
    };
    await axios.post(`${LOGISTICS_URL}/auth/register`, credsBdg);
    
    const loginBdg: any = await axios.post(`${LOGISTICS_URL}/auth/login`, {
        username: credsBdg.username, password: credsBdg.password
    });
    providerBandungToken = loginBdg.data.token;
    providerBandungId = loginBdg.data.user.id;
    const locBdg = loginBdg.data.user.location;

    console.log(`   👉 Provider Bandung Registered.`);
    if (locBdg?.coordinates?.length === 2 && locBdg.coordinates[1] !== 0) {
        console.log(`      ✅ Geocoding SUCCESS: [${locBdg.coordinates[1]}, ${locBdg.coordinates[0]}]`);
    } else {
        console.warn(`      ⚠️ Geocoding WARNING: Coordinates missing or zero.`);
    }

    // --- 2. Register Provider B (JAKARTA - Monas) ---
    // Using ADDRESS ONLY
    const credsJkt = {
        username: `prov_jkt_${rand}`,
        password: 'password123',
        name: `Gudang Jakarta ${rand}`,
        address: 'Jl. Medan Merdeka Barat No.12, Gambir, Jakarta Pusat' 
    };
    await axios.post(`${LOGISTICS_URL}/auth/register`, credsJkt);

    const loginJkt: any = await axios.post(`${LOGISTICS_URL}/auth/login`, {
        username: credsJkt.username, password: credsJkt.password
    });
    providerJakartaToken = loginJkt.data.token;
    providerJakartaId = loginJkt.data.user.id;
    console.log(`   👉 Provider Jakarta Registered.`);

    // --- 3. Add Inventory to BANDUNG Provider ---
    await axios.post(`${LOGISTICS_URL}/inventory`, {
        sku: SKU_MILK, name: 'SGM Eksplor 1+', quantity: 50, unit: 'Box'
    }, { headers: { Authorization: `Bearer ${providerBandungToken}` } });
    console.log(`   ✅ Inventory Added to Bandung Hub.`);

    // --- 4. Add Drivers to BANDUNG Provider ---
    const d1: any = await axios.post(`${LOGISTICS_URL}/drivers`, {
        name: `Asep (Driver 1)`, phone: '08111', vehicle_number: 'D 1111'
    }, { headers: { Authorization: `Bearer ${providerBandungToken}` } });
    driver1Id = d1.data._id;

    const d2: any = await axios.post(`${LOGISTICS_URL}/drivers`, {
        name: `Ujang (Driver 2)`, phone: '08222', vehicle_number: 'D 2222'
    }, { headers: { Authorization: `Bearer ${providerBandungToken}` } });
    driver2Id = d2.data._id;
    console.log(`   ✅ 2 Drivers added to Bandung Hub.`);
}

// ============================================================================ 
// PHASE 2: HEALTH SETUP & ASSIGNMENT CHECK (TESTING DISTANCE MATRIX)
// ============================================================================ 
async function phase2_HealthSetup_And_AssignmentCheck() {
    console.log('\nZy [PHASE 2] Health Setup & Assignment Logic (Testing Distance Matrix)');

    // 1. Register Posyandu in BANDUNG (Gasibu)
    const posyanduCreds = {
        username: `posyandu_bdg_${rand}`,
        password: 'password123',
        name: `Posyandu Gasibu ${rand}`,
        address: 'Gasibu, Bandung', 
        lat: -6.9003, lng: 107.6187
    };

    await axios.post(`${HEALTH_URL}/auth/register`, posyanduCreds);
    console.log(`   👉 Posyandu Registered in BANDUNG (Gasibu). Sync Triggered.`);

    const loginRes: any = await axios.post(`${HEALTH_URL}/auth/login`, {
        username: posyanduCreds.username, password: posyanduCreds.password
    });
    posyanduToken = loginRes.data.token;

    // 2. WAIT & VERIFY ASSIGNMENT
    
        console.log(`   ⏳ Waiting 5s for Background Sync & Assignment...`);
        await sleep(5000);
    }
    
    // ============================================================================
    // HELPER: Create Case, Request Aid, and POLL for Shipment
    // ============================================================================
    async function createCaseAndRequest(patientName: string, weight: number) {
        // 1. Create Patient & Measure
        const pRes: any = await axios.post(`${HEALTH_URL}/patients`, {
            name: patientName, dob: '2024-01-01', gender: 'MALE'
        }, { headers: { Authorization: `Bearer ${posyanduToken}` } });
        const patientId = pRes.data._id;
    
        await axios.post(`${HEALTH_URL}/patients/${patientId}/measurements`, {
            date: new Date().toISOString(), weight: weight, height: 80.0
        }, { headers: { Authorization: `Bearer ${posyanduToken}` } });
    
            // 2. Request Aid
            let requestId;
            let assignedHubIdFromResponse;
            try {
                const reqRes: any = await axios.post(`${HEALTH_URL}/interventions`, {
                    patientId: patientId, urgency: 'HIGH'
                }, { headers: { Authorization: `Bearer ${posyanduToken}` } });
                requestId = reqRes.data.requestId;
                
                // Debugging: Check where it was assigned
                if (reqRes.data.logisticsStatus && reqRes.data.logisticsStatus.data) {
                     assignedHubIdFromResponse = reqRes.data.logisticsStatus.data.hub_id;
                     console.log(`   -> Request Sent: ${requestId}`);
                     console.log(`      [DEBUG] Assigned Hub ID from Backend: ${assignedHubIdFromResponse}`);
                     console.log(`      [DEBUG] Expected Hub ID (Bandung):    ${providerBandungId}`);
                }
                
            } catch (error: any) {            console.error(`   ❌ Request Creation Failed!`);
            console.error(`      Status: ${error.response?.status}`);
            console.error(`      Data:`, JSON.stringify(error.response?.data, null, 2));
            throw error;
        }
    // 3. POLL for Shipment (Retries for reliability)
    let shipment = null;
    let attempts = 0;
    while (attempts < 5) {
        await sleep(1000);
        
        // CHECK BANDUNG PROVIDER
        const resBdg: any = await axios.get(`${LOGISTICS_URL}/shipments`, {
            headers: { Authorization: `Bearer ${providerBandungToken}` } 
        });
        const foundBdg = resBdg.data.find((r: any) => r.health_request_id === requestId);
        
        if (foundBdg) {
            shipment = foundBdg;
            console.log(`      ✅ Found in BANDUNG Hub (Correct Assignment!)`);
            break;
        }

        // CHECK JAKARTA PROVIDER (To ensure it wasn't wrongly assigned)
        const resJkt: any = await axios.get(`${LOGISTICS_URL}/shipments`, {
            headers: { Authorization: `Bearer ${providerJakartaToken}` } 
        });
        const foundJkt = resJkt.data.find((r: any) => r.health_request_id === requestId);

        if (foundJkt) {
            throw new Error(`❌ GMAPS FAIL: Request was assigned to JAKARTA (Far) instead of BANDUNG (Near)!`);
        }

        attempts++;
    }

    if (!shipment) throw new Error(`❌ Request ${requestId} never appeared in Logistics Hubs.`);
    
    return { requestId, shipmentId: shipment._id };
}

// ============================================================================ 
// PHASE 3: SCENARIO - STANDARD FLOW
// ============================================================================ 
async function phase3_Scenario_StandardFlow() {
    console.log('\n🟢 [SCENARIO 1] Standard Happy Path');
    
    const { requestId, shipmentId } = await createCaseAndRequest('Patient Alpha', 8.0);

    // Assign Driver 1
    await axios.put(`${LOGISTICS_URL}/shipments/${shipmentId}/assign`, {
        driver_id: driver1Id,
        items: [{ sku: SKU_MILK, qty: 5 }],
        eta: '15 mins'
    }, { headers: { Authorization: `Bearer ${providerBandungToken}` } });
    console.log(`   ✅ Driver 1 Assigned.`);

    // Confirm
    await axios.post(`${HEALTH_URL}/interventions/confirm`, { requestId }, 
        { headers: { Authorization: `Bearer ${posyanduToken}` } });
    console.log(`   ✅ Receipt Confirmed.`);
}

// ============================================================================ 
// PHASE 4: SCENARIO - INSUFFICIENT STOCK
// ============================================================================ 
async function phase4_Scenario_InsufficientStock() {
    console.log('\n🟠 [SCENARIO 2] Insufficient Stock Error');

    const { shipmentId } = await createCaseAndRequest('Patient Beta', 7.5);

    try {
        await axios.put(`${LOGISTICS_URL}/shipments/${shipmentId}/assign`, {
            driver_id: driver1Id,
            items: [{ sku: SKU_MILK, qty: 1000 }], 
            eta: '1 hour'
        }, { headers: { Authorization: `Bearer ${providerBandungToken}` } });
        
        throw new Error("Should have failed!");
    } catch (e: any) {
        if (e.response && e.response.status === 400) {
            console.log(`   ✅ Correctly rejected: ${e.response.data.message}`);
        } else {
            throw e;
        }
    }
}

// ============================================================================ 
// PHASE 5: SCENARIO - DRIVER BUSY & ALTERNATIVE
// ============================================================================ 
async function phase5_Scenario_DriverBusy() {
    console.log('\n🔴 [SCENARIO 3] Driver Busy Logic');

    // Case Gamma (To make Driver 1 Busy)
    const gamma = await createCaseAndRequest('Patient Gamma', 7.0);

    // Assign Driver 1 to Gamma
    await axios.put(`${LOGISTICS_URL}/shipments/${gamma.shipmentId}/assign`, {
        driver_id: driver1Id, items: [{ sku: SKU_MILK, qty: 5 }], eta: '10 mins'
    }, { headers: { Authorization: `Bearer ${providerBandungToken}` } });
    console.log(`   ✅ Driver 1 assigned to Gamma (Now BUSY).`);

    // Try to Assign Driver 1 to Beta (Pending from Scenario 2)
    // Find Beta's shipment (status PENDING)
    const res: any = await axios.get(`${LOGISTICS_URL}/shipments`, {
        headers: { Authorization: `Bearer ${providerBandungToken}` } 
    });
    const pending = res.data.find((r: any) => r.status === 'PENDING');
    if (!pending) throw new Error("No pending shipment found.");

    try {
        await axios.put(`${LOGISTICS_URL}/shipments/${pending._id}/assign`, {
            driver_id: driver1Id, items: [{ sku: SKU_MILK, qty: 5 }], eta: '10 mins'
        }, { headers: { Authorization: `Bearer ${providerBandungToken}` } });
        
        throw new Error("Should have failed due to BUSY driver!");
    } catch (e: any) {
        if (e.response && e.response.status === 400 && e.response.data.message.includes('BUSY')) {
            console.log(`   ✅ Correctly rejected busy driver: ${e.response.data.message}`);
        } else {
            throw e;
        }
    }

    // Assign Driver 2
    await axios.put(`${LOGISTICS_URL}/shipments/${pending._id}/assign`, {
        driver_id: driver2Id, items: [{ sku: SKU_MILK, qty: 5 }], eta: '10 mins'
    }, { headers: { Authorization: `Bearer ${providerBandungToken}` } });
    console.log(`   ✅ Driver 2 Assigned successfully.`);
}

runTest();