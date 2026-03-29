import { db } from '../config/firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { logger } from '../utils/logger.js';

const CLIENTS_COLLECTION = 'clients';
const APPOINTMENTS_COLLECTION = 'appointments';

/**
 * Clients Database Operations
 */
export const clientsDB = {
  /**
   * Add a new client
   */
  async addClient(clientData) {
    try {
      const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), {
        ...clientData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      logger.info(`Client added: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      logger.error(`Failed to add client: ${error.message}`);
      throw error;
    }
  },

  /**
   * Get all clients
   */
  async getAllClients() {
    try {
      const snapshot = await getDocs(collection(db, CLIENTS_COLLECTION));
      const clients = [];
      snapshot.forEach(doc => {
        clients.push({ id: doc.id, ...doc.data() });
      });
      logger.info(`Retrieved ${clients.length} clients`);
      return clients;
    } catch (error) {
      logger.error(`Failed to get clients: ${error.message}`);
      throw error;
    }
  },

  /**
   * Get a single client by ID
   */
  async getClient(clientId) {
    try {
      const docRef = doc(db, CLIENTS_COLLECTION, clientId);
      const docSnap = await getDocs(query(collection(db, CLIENTS_COLLECTION), where('__name__', '==', clientId)));
      
      if (docSnap.empty) {
        logger.warn(`Client not found: ${clientId}`);
        return null;
      }
      
      const clientDoc = docSnap.docs[0];
      logger.info(`Retrieved client: ${clientId}`);
      return { id: clientDoc.id, ...clientDoc.data() };
    } catch (error) {
      logger.error(`Failed to get client: ${error.message}`);
      throw error;
    }
  },

  /**
   * Update a client
   */
  async updateClient(clientId, updates) {
    try {
      const docRef = doc(db, CLIENTS_COLLECTION, clientId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
      logger.info(`Client updated: ${clientId}`);
    } catch (error) {
      logger.error(`Failed to update client: ${error.message}`);
      throw error;
    }
  },

  /**
   * Delete a client
   */
  async deleteClient(clientId) {
    try {
      const docRef = doc(db, CLIENTS_COLLECTION, clientId);
      await deleteDoc(docRef);
      logger.info(`Client deleted: ${clientId}`);
    } catch (error) {
      logger.error(`Failed to delete client: ${error.message}`);
      throw error;
    }
  },

  /**
   * Subscribe to real-time client updates
   */
  subscribeToClients(callback) {
    try {
      const unsubscribe = onSnapshot(collection(db, CLIENTS_COLLECTION), (snapshot) => {
        const clients = [];
        snapshot.forEach(doc => {
          clients.push({ id: doc.id, ...doc.data() });
        });
        callback(clients);
      });
      logger.info('Subscribed to clients');
      return unsubscribe;
    } catch (error) {
      logger.error(`Failed to subscribe to clients: ${error.message}`);
      throw error;
    }
  }
};

/**
 * Appointments Database Operations
 */
export const appointmentsDB = {
  /**
   * Add a new appointment
   */
  async addAppointment(appointmentData) {
    try {
      const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), {
        ...appointmentData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      logger.info(`Appointment added: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      logger.error(`Failed to add appointment: ${error.message}`);
      throw error;
    }
  },

  /**
   * Get all appointments
   */
  async getAllAppointments() {
    try {
      const snapshot = await getDocs(collection(db, APPOINTMENTS_COLLECTION));
      const appointments = [];
      snapshot.forEach(doc => {
        appointments.push({ id: doc.id, ...doc.data() });
      });
      logger.info(`Retrieved ${appointments.length} appointments`);
      return appointments;
    } catch (error) {
      logger.error(`Failed to get appointments: ${error.message}`);
      throw error;
    }
  },

  /**
   * Get appointments for a specific client
   */
  async getClientAppointments(clientId) {
    try {
      const q = query(collection(db, APPOINTMENTS_COLLECTION), where('clientId', '==', clientId));
      const snapshot = await getDocs(q);
      const appointments = [];
      snapshot.forEach(doc => {
        appointments.push({ id: doc.id, ...doc.data() });
      });
      logger.info(`Retrieved ${appointments.length} appointments for client: ${clientId}`);
      return appointments;
    } catch (error) {
      logger.error(`Failed to get client appointments: ${error.message}`);
      throw error;
    }
  },

  /**
   * Get appointments for a specific date
   */
  async getAppointmentsByDate(dateString) {
    try {
      const q = query(collection(db, APPOINTMENTS_COLLECTION), where('date', '==', dateString));
      const snapshot = await getDocs(q);
      const appointments = [];
      snapshot.forEach(doc => {
        appointments.push({ id: doc.id, ...doc.data() });
      });
      logger.info(`Retrieved ${appointments.length} appointments for date: ${dateString}`);
      return appointments;
    } catch (error) {
      logger.error(`Failed to get appointments by date: ${error.message}`);
      throw error;
    }
  },

  /**
   * Update an appointment
   */
  async updateAppointment(appointmentId, updates) {
    try {
      const docRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
      logger.info(`Appointment updated: ${appointmentId}`);
    } catch (error) {
      logger.error(`Failed to update appointment: ${error.message}`);
      throw error;
    }
  },

  /**
   * Delete an appointment
   */
  async deleteAppointment(appointmentId) {
    try {
      const docRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
      await deleteDoc(docRef);
      logger.info(`Appointment deleted: ${appointmentId}`);
    } catch (error) {
      logger.error(`Failed to delete appointment: ${error.message}`);
      throw error;
    }
  },

  /**
   * Subscribe to real-time appointment updates
   */
  subscribeToAppointments(callback) {
    try {
      const unsubscribe = onSnapshot(collection(db, APPOINTMENTS_COLLECTION), (snapshot) => {
        const appointments = [];
        snapshot.forEach(doc => {
          appointments.push({ id: doc.id, ...doc.data() });
        });
        callback(appointments);
      });
      logger.info('Subscribed to appointments');
      return unsubscribe;
    } catch (error) {
      logger.error(`Failed to subscribe to appointments: ${error.message}`);
      throw error;
    }
  }
};