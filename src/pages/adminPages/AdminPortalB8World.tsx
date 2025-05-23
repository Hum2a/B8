import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserCheck, FaDollarSign, FaChartLine, FaCog, FaDownload, FaEnvelope, FaEdit, FaSave, FaCheck, FaSpinner, FaPlus, FaTrash } from 'react-icons/fa';
import { IconPicker } from '../../utils/iconMapping';
import '../../styles/adminStyles/AdminPortalB8World.css';
import { db } from '../../firebase/firebase';
import { doc, updateDoc, getDoc, collection, query, getDocs, addDoc, deleteDoc, orderBy, limit, Timestamp } from 'firebase/firestore';

interface AdminPortalB8WorldProps {
  stats: { totalMembers: number; activeMembers: number; revenue: number; engagement: number };
}

// Define interfaces for editable data
interface Initiative {
  id: string;
  name: string;
  status: 'active' | 'planning' | 'pending';
  participants: number;
  lastUpdated: string;
  description?: string;
}

interface Donation {
  id: string;
  donor: string;
  amount: number;
  initiative: string;
  date: string;
  message?: string;
}

interface Partner {
  id: string;
  organization: string;
  partnershipType: string;
  status: 'active' | 'pending' | 'inactive';
  startDate: string;
  contactPerson?: string;
  email?: string;
  description?: string;
  logoUrl?: string;
  websiteLink?: string;
  icon?: string;
}

interface DonationInvoice {
  id: string;
  sessionId: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  timestamp: Timestamp;
  status: 'pending' | 'completed';
}

export function AdminPortalB8World({ stats: initialStats }: AdminPortalB8WorldProps) {
  const [stats, setStats] = useState(initialStats);
  
  const [editMode, setEditMode] = useState({
    stats: false,
    initiative: null as string | null,
    donation: null as string | null,
    partner: null as string | null,
    partners: null as string | null
  });
  
  const [saving, setSaving] = useState('');
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  
  const [donations, setDonations] = useState<Donation[]>([]);
  
  const [partners, setPartners] = useState<Partner[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [donationInvoices, setDonationInvoices] = useState<DonationInvoice[]>([]);
  const [totalRaised, setTotalRaised] = useState(0);

  // Load data from Firestore
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Fetch settings document
      const docRef = doc(db, 'settings', 'b8World');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStats({
          totalMembers: data.totalMembers || initialStats.totalMembers,
          activeMembers: data.activeMembers || initialStats.activeMembers,
          revenue: data.revenue || initialStats.revenue,
          engagement: data.engagement || initialStats.engagement
        });
        
        // Set initiatives and donations from the settings document
        if (data.initiatives) setInitiatives(data.initiatives);
        if (data.donations) setDonations(data.donations);
      }

      // Fetch donation invoices
      const invoicesQuery = query(
        collection(db, 'B8World', 'Donations', 'Invoices'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const invoicesSnapshot = await getDocs(invoicesQuery);
      const invoicesData: DonationInvoice[] = [];
      let total = 0;

      invoicesSnapshot.forEach((doc) => {
        const invoice = {
          id: doc.id,
          sessionId: doc.data().sessionId,
          amount: doc.data().amount,
          donorName: doc.data().donorName || 'Anonymous',
          donorEmail: doc.data().donorEmail || 'Not provided',
          timestamp: doc.data().timestamp,
          status: doc.data().status
        };
        invoicesData.push(invoice);
        if (invoice.status === 'completed') {
          total += invoice.amount;
        }
      });

      setDonationInvoices(invoicesData);
      setTotalRaised(total);
      
      // Fetch partners from dedicated collection
      const partnersQuery = query(collection(db, 'B8WorldPartners'));
      const partnersSnapshot = await getDocs(partnersQuery);
      
      const partnersData: Partner[] = [];
      partnersSnapshot.forEach((doc) => {
        partnersData.push({
          id: doc.id,
          organization: doc.data().organization || '',
          partnershipType: doc.data().partnershipType || '',
          status: doc.data().status || 'pending',
          startDate: doc.data().startDate || '',
          contactPerson: doc.data().contactPerson || '',
          email: doc.data().email || '',
          description: doc.data().description || '',
          logoUrl: doc.data().logoUrl || '',
          websiteLink: doc.data().websiteLink || '',
          icon: doc.data().icon || 'FaHandHoldingHeart'
        });
      });
      
      setPartners(partnersData);
    } catch (error) {
      console.error('Error fetching B8 World data:', error);
      setErrorMessage('Error loading data. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle edit mode for a section
  const toggleEditMode = (section: keyof typeof editMode, id: string | null = null) => {
    setEditMode({
      ...editMode,
      [section]: section === 'stats' ? !editMode.stats : id
    });
  };
  
  // Save functions for each section
  const saveStats = async () => {
    try {
      setSaving('stats');
      setSuccessMessage('');
      setErrorMessage('');
      
      await updateDoc(doc(db, 'settings', 'b8World'), {
        stats: stats
      });
      
      setSuccessMessage('Stats updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
      setEditMode({...editMode, stats: false});
    } catch (error) {
      console.error('Error saving stats:', error);
      setErrorMessage('Error saving stats: ' + (error as Error).message);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSaving('');
    }
  };
  
  const saveInitiative = async (initiative: Initiative) => {
    try {
      setSaving(`initiative-${initiative.id}`);
      setSuccessMessage('');
      setErrorMessage('');
      
      const updatedInitiatives = initiatives.map(i => 
        i.id === initiative.id ? initiative : i
      );
      
      await updateDoc(doc(db, 'settings', 'b8World'), {
        initiatives: updatedInitiatives
      });
      
      setInitiatives(updatedInitiatives);
      setSuccessMessage('Initiative updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
      setEditMode({...editMode, initiative: null});
    } catch (error) {
      console.error('Error saving initiative:', error);
      setErrorMessage('Error saving initiative: ' + (error as Error).message);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSaving('');
    }
  };
  
  const savePartner = async (partner: Partner) => {
    setSaving(`partner-${partner.id}`);
    setErrorMessage('');
    
    try {
      // Reference to the partners collection
      const partnersCollectionRef = collection(db, 'B8WorldPartners');
      
      // Check if this is a new partner or an existing one
      if (partner.id.startsWith('partner-')) {
        // This is a new partner, add it to the collection
        const newPartnerRef = await addDoc(partnersCollectionRef, {
          organization: partner.organization,
          partnershipType: partner.partnershipType,
          status: partner.status,
          startDate: partner.startDate,
          contactPerson: partner.contactPerson || '',
          email: partner.email || '',
          description: partner.description || '',
          logoUrl: partner.logoUrl || '',
          websiteLink: partner.websiteLink || '',
          icon: partner.icon || 'FaHandHoldingHeart',
          createdAt: new Date()
        });
        
        // Update the partner in state with the new ID from Firestore
        setPartners(partners.map(p => 
          p.id === partner.id ? { ...partner, id: newPartnerRef.id } : p
        ));
      } else {
        // This is an existing partner, update it
        const partnerRef = doc(db, 'B8WorldPartners', partner.id);
        await updateDoc(partnerRef, {
          organization: partner.organization,
          partnershipType: partner.partnershipType,
          status: partner.status,
          startDate: partner.startDate,
          contactPerson: partner.contactPerson || '',
          email: partner.email || '',
          description: partner.description || '',
          logoUrl: partner.logoUrl || '',
          websiteLink: partner.websiteLink || '',
          icon: partner.icon || 'FaHandHoldingHeart',
          updatedAt: new Date()
        });
      }
      
      setSuccessMessage('Partner saved successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
      toggleEditMode('partner', null);
    } catch (error) {
      console.error('Error saving partner:', error);
      setErrorMessage('Failed to save partner. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSaving('');
    }
  };
  
  // Add new items
  const addInitiative = () => {
    const newInitiative: Initiative = {
      id: Date.now().toString(),
      name: 'New Initiative',
      status: 'planning',
      participants: 0,
      lastUpdated: new Date().toLocaleDateString(),
      description: 'Description of the new initiative'
    };
    
    setInitiatives([...initiatives, newInitiative]);
    setEditMode({...editMode, initiative: newInitiative.id});
  };
  
  const addPartner = () => {
    const newPartner: Partner = {
      id: `partner-${Date.now()}`,
      organization: 'New Partner Organization',
      partnershipType: 'Charity',
      status: 'pending',
      startDate: new Date().toISOString().split('T')[0],
      contactPerson: '',
      email: '',
      description: '',
      logoUrl: '',
      websiteLink: '',
      icon: 'FaHandHoldingHeart'
    };
    setPartners([...partners, newPartner]);
    toggleEditMode('partner', newPartner.id);
  };
  
  // Remove items
  const removeInitiative = async (id: string) => {
    try {
      setSaving(`remove-initiative-${id}`);
      const updatedInitiatives = initiatives.filter(i => i.id !== id);
      
      await updateDoc(doc(db, 'settings', 'b8World'), {
        initiatives: updatedInitiatives
      });
      
      setInitiatives(updatedInitiatives);
      setSuccessMessage('Initiative removed successfully');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error removing initiative:', error);
      setErrorMessage('Error removing initiative: ' + (error as Error).message);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSaving('');
    }
  };
  
  const removePartner = async (id: string) => {
    setSaving(`remove-partner-${id}`);
    setErrorMessage('');
    
    try {
      // Only delete from Firestore if it's a real document (not a temporary one)
      if (!id.startsWith('partner-')) {
        await deleteDoc(doc(db, 'B8WorldPartners', id));
      }
      
      // Remove from state
      setPartners(partners.filter(partner => partner.id !== id));
      setSuccessMessage('Partner removed successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error removing partner:', error);
      setErrorMessage('Failed to remove partner. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSaving('');
    }
  };
  
  // Handle form changes
  const handleStatsChange = (field: keyof typeof stats, value: string | number) => {
    setStats({
      ...stats,
      [field]: typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value
    });
  };
  
  const updateInitiative = (id: string, field: keyof Initiative, value: string | number) => {
    setInitiatives(initiatives.map(initiative => {
      if (initiative.id === id) {
        if (field === 'participants') {
          return { ...initiative, [field]: Number(value) };
        } else if (field === 'status') {
          return { ...initiative, [field]: value as 'active' | 'planning' | 'pending' };
        }
        return { ...initiative, [field]: value };
      }
      return initiative;
    }));
  };
  
  const updatePartner = (id: string, field: keyof Partner, value: string) => {
    setPartners(partners.map(partner => 
      partner.id === id ? { ...partner, [field]: value } : partner
    ));
  };
  
  // Add a specific style to the partner edit form
  const partnerEditFormStyle = {
    position: 'relative' as const,
    zIndex: 20,
  };

  // Add a specific style to inputs
  const inputStyle = {
    position: 'relative' as const,
    zIndex: 30,
    pointerEvents: 'auto' as const,
  };

  return (
    <div className="admin-portal-page">
      <h2>B8 World Admin Panel</h2>
      
      {/* Stats Section */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3>Total Participants</h3>
          {editMode.stats ? (
            <input 
              type="number" 
              className="edit-input"
              value={stats.totalMembers}
              onChange={(e) => handleStatsChange('totalMembers', e.target.value)}
            />
          ) : (
            <p className="stat-value">{stats.totalMembers}</p>
          )}
          <FaUsers size={24} color="#9C27B0" />
        </div>
        <div className="admin-stat-card">
          <h3>Active Participants</h3>
          {editMode.stats ? (
            <input 
              type="number" 
              className="edit-input"
              value={stats.activeMembers}
              onChange={(e) => handleStatsChange('activeMembers', e.target.value)}
            />
          ) : (
            <p className="stat-value">{stats.activeMembers}</p>
          )}
          <FaUserCheck size={24} color="#9C27B0" />
        </div>
        <div className="admin-stat-card">
          <h3>Fundraised</h3>
          {editMode.stats ? (
            <input 
              type="number" 
              className="edit-input"
              value={stats.revenue}
              onChange={(e) => handleStatsChange('revenue', e.target.value)}
            />
          ) : (
            <p className="stat-value">£{totalRaised.toLocaleString()}</p>
          )}
          <FaDollarSign size={24} color="#9C27B0" />
        </div>
        <div className="admin-stat-card">
          <h3>Engagement Rate</h3>
          {editMode.stats ? (
            <input 
              type="number" 
              className="edit-input"
              value={stats.engagement}
              onChange={(e) => handleStatsChange('engagement', e.target.value)}
            />
          ) : (
            <p className="stat-value">{stats.engagement}%</p>
          )}
          <FaChartLine size={24} color="#9C27B0" />
        </div>
      </div>
      
      <div className="stats-actions">
        <button 
          className="action-button"
          onClick={() => setEditMode({...editMode, stats: !editMode.stats})}
        >
          {editMode.stats ? 'Cancel' : 'Edit Stats'}
        </button>
        
        {editMode.stats && (
          <button 
            className="action-button save"
            onClick={saveStats}
            disabled={saving === 'stats'}
          >
            {saving === 'stats' ? <FaSpinner className="spinner" /> : <FaSave />}
            {saving === 'stats' ? 'Saving...' : 'Save Stats'}
          </button>
        )}
      </div>

      <div className="admin-actions">
        <h3>Administrative Actions</h3>
        <div className="admin-action-buttons">
          <button className="admin-action-button">
            <FaCog /> Configure B8 World
          </button>
          <button className="admin-action-button">
            <FaDownload /> Export Participant Data
          </button>
          <button className="admin-action-button">
            <FaEnvelope /> Message All Participants
          </button>
        </div>
      </div>

      {/* Initiatives Section */}
      <div className="world-admin-section">
        <div className="section-header">
          <h3>World Initiatives</h3>
          <button className="add-button" onClick={addInitiative}>
            <FaPlus /> Add Initiative
          </button>
        </div>
        
        <div className="world-admin-grid">
          {initiatives.map((initiative) => (
            <div className="world-admin-card" key={initiative.id}>
              <div className="world-admin-header">
                <h4>{initiative.name}</h4>
                <div className={`status-badge status-${initiative.status}`}>
                  {initiative.status.charAt(0).toUpperCase() + initiative.status.slice(1)}
                </div>
              </div>
              
              {editMode.initiative === initiative.id ? (
                <div className="world-admin-edit-form">
                  <div className="admin-world-admin-world-form-group">
                    <label>Name:</label>
                    <input 
                      type="text" 
                      value={initiative.name}
                      onChange={(e) => updateInitiative(initiative.id, 'name', e.target.value)}
                      className="edit-input"
                    />
                  </div>
                  
                  <div className="admin-world-admin-world-form-group">
                    <label>Status:</label>
                    <select 
                      value={initiative.status}
                      onChange={(e) => updateInitiative(initiative.id, 'status', e.target.value)}
                      className="edit-select"
                    >
                      <option value="active">Active</option>
                      <option value="planning">Planning</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  
                  <div className="admin-world-admin-world-form-group">
                    <label>Participants:</label>
                    <input 
                      type="number" 
                      value={initiative.participants}
                      onChange={(e) => updateInitiative(initiative.id, 'participants', e.target.value)}
                      className="edit-input"
                    />
                  </div>
                  
                  <div className="admin-world-admin-world-form-group">
                    <label>Last Updated:</label>
                    <input 
                      type="text" 
                      value={initiative.lastUpdated}
                      onChange={(e) => updateInitiative(initiative.id, 'lastUpdated', e.target.value)}
                      className="edit-input"
                    />
                  </div>
                  
                  <div className="admin-world-admin-world-form-group">
                    <label>Description:</label>
                    <textarea 
                      value={initiative.description || ''}
                      onChange={(e) => updateInitiative(initiative.id, 'description', e.target.value)}
                      className="edit-textarea"
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      className="action-button cancel"
                      onClick={() => toggleEditMode('initiative', null)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="action-button save"
                      onClick={() => saveInitiative(initiative)}
                      disabled={saving === `initiative-${initiative.id}`}
                    >
                      {saving === `initiative-${initiative.id}` ? <FaSpinner className="spinner" /> : <FaSave />}
                      {saving === `initiative-${initiative.id}` ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="world-admin-content">
                    <div className="content-row">
                      <strong>Participants:</strong>
                      <span>{initiative.participants}</span>
                    </div>
                    <div className="content-row">
                      <strong>Last Updated:</strong>
                      <span>{initiative.lastUpdated}</span>
                    </div>
                    {initiative.description && (
                      <p className="description">{initiative.description}</p>
                    )}
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="action-button"
                      onClick={() => toggleEditMode('initiative', initiative.id)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => removeInitiative(initiative.id)}
                      disabled={saving === `remove-initiative-${initiative.id}`}
                    >
                      {saving === `remove-initiative-${initiative.id}` ? <FaSpinner className="spinner" /> : <FaTrash />}
                      {saving === `remove-initiative-${initiative.id}` ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Donations Section */}
      <div className="world-admin-section">
        <div className="section-header">
          <div className="section-header-content">
            <h3>Recent Donations</h3>
            <div className="total-raised">
              Total Raised: £{totalRaised.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="world-admin-grid">
          {donationInvoices.map((invoice) => (
            <div className="world-admin-card" key={invoice.id}>
              <div className="world-admin-header">
                <h4>{invoice.donorName}</h4>
                <div className={`donation-amount ${invoice.status}`}>
                  £{invoice.amount.toLocaleString()}
                </div>
              </div>
              
              <div className="world-admin-content">
                <div className="content-row">
                  <strong>Status:</strong>
                  <span className={`status-badge status-${invoice.status}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </div>
                <div className="content-row">
                  <strong>Date:</strong>
                  <span>{invoice.timestamp?.toDate().toLocaleDateString()}</span>
                </div>
                <div className="content-row">
                  <strong>Email:</strong>
                  <span>{invoice.donorEmail}</span>
                </div>
                <div className="content-row">
                  <strong>Session ID:</strong>
                  <span className="session-id">{invoice.sessionId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partners Section */}
      <div className="world-admin-section">
        <div className="section-header">
          <h3>World Partners</h3>
          <button className="add-button" onClick={addPartner}>
            <FaPlus /> Add Partner
          </button>
        </div>
        
        <div className="world-admin-grid">
          {partners.map((partner) => (
            <div key={partner.id} className="world-admin-card">
              {editMode.partner === partner.id ? (
                <div className="world-admin-edit-form" style={partnerEditFormStyle}>
                  <div className="admin-world-form-group">
                    <label>Organization Name</label>
                    <input 
                      type="text" 
                      value={partner.organization} 
                      onChange={(e) => updatePartner(partner.id, 'organization', e.target.value)}
                      className="edit-input"
                      style={inputStyle}
                    />
                  </div>
                  <div className="admin-world-form-group">
                    <label>Partnership Type</label>
                    <input 
                      type="text" 
                      value={partner.partnershipType} 
                      onChange={(e) => updatePartner(partner.id, 'partnershipType', e.target.value)}
                      className="edit-input"
                      style={inputStyle}
                    />
                  </div>
                  <div className="admin-world-form-group">
                    <label>Status</label>
                    <select 
                      value={partner.status} 
                      onChange={(e) => updatePartner(partner.id, 'status', e.target.value as Partner['status'])}
                      className="edit-select"
                      style={inputStyle}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="admin-world-form-group" style={{ zIndex: 30, position: 'relative' }}>
                    <label>Icon</label>
                    <IconPicker 
                      selectedIcon={partner.icon || 'FaHandHoldingHeart'} 
                      onSelectIcon={(iconName) => updatePartner(partner.id, 'icon', iconName)} 
                    />
                  </div>
                  <div className="admin-world-form-group">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      value={partner.startDate} 
                      onChange={(e) => updatePartner(partner.id, 'startDate', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div className="admin-world-form-group">
                    <label>Contact Person</label>
                    <input 
                      type="text" 
                      value={partner.contactPerson || ''} 
                      onChange={(e) => updatePartner(partner.id, 'contactPerson', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div className="admin-world-form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={partner.email || ''} 
                      onChange={(e) => updatePartner(partner.id, 'email', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div className="admin-world-form-group">
                    <label>Description</label>
                    <textarea 
                      className="edit-textarea"
                      value={partner.description || ''} 
                      onChange={(e) => updatePartner(partner.id, 'description', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div className="admin-world-form-group">
                    <label>Logo URL</label>
                    <input 
                      type="text" 
                      value={partner.logoUrl || ''} 
                      onChange={(e) => updatePartner(partner.id, 'logoUrl', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div className="admin-world-form-group">
                    <label>Website Link</label>
                    <input 
                      type="text" 
                      value={partner.websiteLink || ''} 
                      onChange={(e) => updatePartner(partner.id, 'websiteLink', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div className="form-actions">
                    <button 
                      className="action-button save" 
                      onClick={() => savePartner(partner)}
                      disabled={saving === `partner-${partner.id}`}
                    >
                      {saving === `partner-${partner.id}` ? <FaSpinner className="spinner" /> : <FaSave />}
                      {saving === `partner-${partner.id}` ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="world-admin-content">
                    <div className="content-row">
                      <strong>Organization:</strong>
                      <span>{partner.organization}</span>
                    </div>
                    <div className="content-row">
                      <strong>Partnership Type:</strong>
                      <span>{partner.partnershipType}</span>
                    </div>
                    <div className="content-row">
                      <strong>Status:</strong>
                      <span>{partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}</span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="action-button"
                      onClick={() => toggleEditMode('partner', partner.id)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => removePartner(partner.id)}
                      disabled={saving === `remove-partner-${partner.id}`}
                    >
                      {saving === `remove-partner-${partner.id}` ? <FaSpinner className="spinner" /> : <FaTrash />}
                      {saving === `remove-partner-${partner.id}` ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}