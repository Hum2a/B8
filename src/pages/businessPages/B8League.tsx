import { useEffect, useState } from 'react';
import Navbar from '../../components/ui/Navbar';
import HamburgerMenu from '../../components/ui/HamburgerMenu';
import Footer from '../../components/ui/Footer';
import { FaFutbol, FaGamepad, FaTableTennis } from 'react-icons/fa';
import '../../styles/businessStyles/B8League.css';
import { ComingSoonOverlay } from '../../components/overlays/ComingSoonOverlay';
import ContactForm from '../../components/ui/ContactForm';
import TournamentCreator from '../../components/tournament/TournamentCreator';
import TournamentList from '../../components/tournament/TournamentList';
import '../../styles/tournamentStyles/TournamentCreator.css';
import '../../styles/tournamentStyles/TournamentList.css';
import { useB8SectionVisibility } from '../../contexts/B8SectionVisibilityContext';
import SocialChannels from '../../components/ui/SocialChannels';
import { PasswordProtectedPage } from '../../components/overlays/PasswordProtectedPage';
import { useAuth } from '../../contexts/AuthContext';
import { joinTeam, createTeam, getTeams, getPlayerTeam, scheduleMatch } from '../../firebase/b8fc';
import { Team } from '../../types/b8fc';
import { toast } from 'react-toastify';
import { serverTimestamp } from 'firebase/firestore';

type LeagueSport = 'football' | 'badminton' | 'esports';

export default function B8League() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSport, setActiveSport] = useState<LeagueSport>('football');
  const [teams, setTeams] = useState<Team[]>([]);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const { currentUser: user } = useAuth();
  
  const { shouldShowSection, isAdminOrDeveloper, sectionVisibility, getYoutubeLink } = useB8SectionVisibility();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch teams and user's team on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTeams = await getTeams();
        setTeams(fetchedTeams);
        
        if (user) {
          const playerTeam = await getPlayerTeam(user.uid);
          setUserTeam(playerTeam);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        toast.error('Failed to load teams');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const checkUserTeamStatus = async (userId: string) => {
    // Get all teams
    const allTeams = await getTeams();
    
    // Check if user is captain of any team
    const isCaptain = allTeams.some(team => team.captain === userId);
    
    if (isCaptain) {
      throw new Error('You are already a captain of another team');
    }
    
    // Check if user is a member of any team
    const isTeamMember = allTeams.some(team => 
      team.members.some(member => member.uid === userId)
    );
    
    if (isTeamMember) {
      throw new Error('You are already a member of another team');
    }
    
    return true;
  };

  // Handle joining a team
  const handleJoinTeam = async (teamId: string) => {
    if (!user) {
      toast.error('Please sign in to join a team');
      return;
    }

    try {
      await joinTeam(teamId, user);
      toast.success('Successfully joined team!');
      
      // Refresh user's team data
      const playerTeam = await getPlayerTeam(user.uid);
      setUserTeam(playerTeam);
    } catch (error) {
      console.error('Error joining team:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to join team');
    }
  };

  // Update the handleCreateTeam function
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to create a team');
      return;
    }

    if (!newTeamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    try {
      // Check if user can create a team
      await checkUserTeamStatus(user.uid);

      // Create initial member object
      const initialMember = {
        uid: user.uid,
        name: user.displayName || 'Unknown Player',
        role: 'captain' as const,
        joinedAt: serverTimestamp()
      };

      // Create team with the initial member
      const teamData = {
        name: newTeamName.trim(),
        isPreset: false,
        createdAt: serverTimestamp(),
        captain: user.uid, // Make sure this matches the Team interface
        members: [initialMember]
      };

      await createTeam(teamData, user);
      toast.success('Team created successfully!');
      setNewTeamName('');
      setShowCreateTeamModal(false); // Close the modal after success
      
      // Refresh teams and user's team data
      const [fetchedTeams, playerTeam] = await Promise.all([
        getTeams(),
        getPlayerTeam(user.uid)
      ]);
      setTeams(fetchedTeams);
      setUserTeam(playerTeam);
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create team');
    }
  };

  // Handle scheduling a match
  const handleScheduleMatch = async (matchData: any) => {
    if (!user) {
      toast.error('Please sign in to schedule a match');
      return;
    }

    try {
      await scheduleMatch(matchData);
      toast.success('Match scheduled successfully!');
      setShowScheduleModal(false);
    } catch (error) {
      console.error('Error scheduling match:', error);
      toast.error('Failed to schedule match');
    }
  };

  // Create Team Modal
  const CreateTeamModal = () => (
    <div className="league-modal-overlay">
      <div className="league-modal-content">
        <h3>Create New Team</h3>
        <form onSubmit={handleCreateTeam}>
          <div className="form-group">
            <label htmlFor="teamName">Team Name</label>
            <input
              id="teamName"
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Enter team name"
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" disabled={loading || !newTeamName.trim() || !user}>
              {!user ? 'Please sign in to create team' : 'Create Team'}
            </button>
            <button type="button" onClick={() => setShowCreateTeamModal(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Show admin notice for hidden sections
  const AdminNotice = ({ section, name }: { section: keyof typeof sectionVisibility, name: string }) => {
    if (isAdminOrDeveloper && !sectionVisibility[section]) {
      return (
        <div className="admin-notice">
          <p><strong>Admin Notice:</strong> The {name} section is currently hidden from regular users.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <PasswordProtectedPage businessId="league">
      <ComingSoonOverlay businessId="league">
        <div className="league-page">
          {isMobile ? <HamburgerMenu /> : <Navbar />}

          {/* Hero Section */}
          {shouldShowSection('showHero') && (
            <section className="league-hero">
              <AdminNotice section="showHero" name="Hero" />
              <h1>B8 League</h1>
              <p>Excellence in sports - Football, Badminton, and Esports</p>
            </section>
          )}

          {/* Sport Navigation */}
          {shouldShowSection('showSportNavigation') && (
            <section className="league-nav">
              <AdminNotice section="showSportNavigation" name="Sport Navigation" />
              <div className="league-tabs">
                <button 
                  className={`league-tab ${activeSport === 'football' ? 'active' : ''}`} 
                  onClick={() => setActiveSport('football')}
                >
                  <FaFutbol /> B8FC
                </button>
                <button 
                  className={`league-tab ${activeSport === 'badminton' ? 'active' : ''}`} 
                  onClick={() => setActiveSport('badminton')}
                >
                  <FaTableTennis /> B8dminton
                </button>
                <button 
                  className={`league-tab ${activeSport === 'esports' ? 'active' : ''}`} 
                  onClick={() => setActiveSport('esports')}
                >
                  <FaGamepad /> B8Esports
                </button>
              </div>
            </section>
          )}

          {/* Football Section */}
          {activeSport === 'football' && shouldShowSection('showFootball') && (
            <div className="sport-section">
              <AdminNotice section="showFootball" name="Football Content" />
              {/* Intro Section */}
              <section className="league-intro-section">
                <h2>Welcome to B8FC</h2>
                <p>
                  B8FC is our premier football club with teams competing at various levels. 
                  Join our community of passionate football enthusiasts and be part of the action.
                </p>
              </section>

              {/* B8FC Sign Up Section */}
              <section className="b8fc-signup-section">
                <h3>Join B8FC</h3>
                <div className="preset-teams">
                  <h4>Preset Teams</h4>
                  <div className="teams-grid">
                    {teams.filter(team => team.isPreset).map(team => (
                      <div key={team.id} className="team-card">
                        <h5>{team.name}</h5>
                        <button 
                          className="join-team-btn"
                          onClick={() => handleJoinTeam(team.id)}
                          disabled={loading || userTeam !== null}
                        >
                          {userTeam ? 'Already in a team' : 'Join Team'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="join-options">
                  <div className="join-option">
                    <h4>Join as Captain</h4>
                    <p>Create and lead your own team</p>
                    <button 
                      className="create-team-btn"
                      onClick={async () => {
                        if (!user) {
                          toast.error('Please sign in to create a team');
                          return;
                        }
                        try {
                          // Check if user can create a team before showing the modal
                          await checkUserTeamStatus(user.uid);
                          setShowCreateTeamModal(true);
                        } catch (error) {
                          toast.error(error instanceof Error ? error.message : 'Cannot create team');
                        }
                      }}
                      disabled={loading || userTeam !== null}
                    >
                      {!user 
                        ? 'Sign in to Create Team' 
                        : userTeam 
                          ? 'Already in a team' 
                          : 'Create Team'
                      }
                    </button>
                  </div>
                  <div className="join-option">
                    <h4>Join as Player</h4>
                    <p>Join an existing team</p>
                    <button 
                      className="join-player-btn"
                      onClick={() => {
                        if (!user) {
                          toast.error('Please sign in to join a team');
                          return;
                        }
                        setShowCreateTeamModal(true);
                      }}
                      disabled={loading || userTeam !== null}
                    >
                      {!user ? 'Sign in to Join Team' : userTeam ? 'Already in a team' : 'Find Team'}
                    </button>
                  </div>
                </div>

                <div className="match-scheduler">
                  <h4>Match Scheduler</h4>
                  <p>View upcoming matches and schedule new games</p>
                  <button 
                    className="schedule-match-btn"
                    onClick={() => setShowScheduleModal(true)}
                    disabled={loading || !userTeam}
                  >
                    Schedule Match
                  </button>
                </div>
              </section>

              {/* Video Section */}
              <section className="hero-video">
                <div className="video-container">
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYoutubeLink()}
                    title="B8FC Highlights Video" 
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ pointerEvents: 'auto' }}
                  ></iframe>
                </div>
              </section>

              {/* Kit Shop Section */}
              <section className="league-kit-shop">
                <h3>Official B8FC Merchandise</h3>
                <div className="league-product-card" onClick={() => setIsModalOpen(true)}>
                  <img src="/assets/football1.jpg" alt="B8 Jersey" />
                  <p>B8FC Official Jersey - $50</p>
                </div>
              </section>

              {/* Gallery Section */}
              <section className="league-gallery">
                <div className="league-gallery-item">
                  <img src="/assets/football1.jpg" alt="Football Match 1" />
                  <p>Match 1: Championship League 2023</p>
                </div>
                <div className="league-gallery-item">
                  <img src="/assets/football2.jpg" alt="Football Match 2" />
                  <p>Match 2: Youth Development Camp</p>
                </div>
                <div className="league-gallery-item">
                  <img src="/assets/football3.jpg" alt="Football Match 3" />
                  <p>Match 3: International Friendly</p>
                </div>
              </section>

              {/* Player Widget */}
              <section className="league-player-widget">
                <h3>Player Spotlight</h3>
                <div className="league-player-card">
                  <img src="/assets/player1.jpg" alt="Star Player" />
                  <h4>John Doe - Forward</h4>
                  <p>Goals: 15 | Assists: 10 | Appearances: 20</p>
                </div>
              </section>
            </div>
          )}

          {/* Badminton Section */}
          {activeSport === 'badminton' && shouldShowSection('showBadminton') && (
            <div className="sport-section">
              <AdminNotice section="showBadminton" name="Badminton Content" />
              {/* Intro Section */}
              <section className="league-intro-section">
                <h2>Welcome to B8Badminton</h2>
                <p>
                  B8Badminton is our fast-growing badminton division featuring top players and regular tournaments.
                  Join us for competitive play, coaching, and a supportive community of badminton enthusiasts.
                </p>
              </section>

              {/* Video Section */}
              <section className="hero-video">
                <div className="video-placeholder">
                  <p>B8Badminton Tournament Highlights</p>
                </div>
              </section>

              {/* Kit Shop Section */}
              <section className="league-kit-shop">
                <h3>Official B8Badminton Gear</h3>
                <div className="league-product-card">
                  <img src="/assets/football1.jpg" alt="B8 Badminton Kit" />
                  <p>B8Badminton Pro Racket - $120</p>
                </div>
              </section>

              {/* Gallery Section */}
              <section className="league-gallery">
                <div className="league-gallery-item">
                  <img src="/assets/football1.jpg" alt="Badminton Match 1" />
                  <p>Tournament Final: B8 Open 2023</p>
                </div>
                <div className="league-gallery-item">
                  <img src="/assets/football2.jpg" alt="Badminton Match 2" />
                  <p>Youth Development Program</p>
                </div>
                <div className="league-gallery-item">
                  <img src="/assets/football3.jpg" alt="Badminton Match 3" />
                  <p>B8 Badminton International Championship</p>
                </div>
              </section>

              {/* Player Widget */}
              <section className="league-player-widget">
                <h3>Player Spotlight</h3>
                <div className="league-player-card">
                  <img src="/assets/player1.jpg" alt="Star Player" />
                  <h4>Jane Smith - Singles Specialist</h4>
                  <p>Wins: 45 | Tournament Titles: 8 | World Ranking: 24</p>
                </div>
              </section>
            </div>
          )}

          {/* Esports Section */}
          {activeSport === 'esports' && shouldShowSection('showEsports') && (
            <div className="sport-section">
              <AdminNotice section="showEsports" name="Esports Content" />
              {/* Intro Section */}
              <section className="league-intro-section">
                <h2>Welcome to B8Esports</h2>
                <p>
                  B8Esports is our cutting-edge gaming division with teams competing in top titles like League of Legends, 
                  CS:GO, and Valorant. Join our growing community of professional and amateur gamers.
                </p>
              </section>

              {/* Video Section */}
              <section className="hero-video">
                <div className="video-placeholder">
                  <p>B8Esports Tournament Highlights</p>
                </div>
              </section>

              {/* Kit Shop Section */}
              <section className="league-kit-shop">
                <h3>Official B8Esports Merchandise</h3>
                <div className="league-product-card">
                  <img src="/assets/football1.jpg" alt="B8 Gaming Jersey" />
                  <p>B8Esports Pro Gaming Jersey - $60</p>
                </div>
              </section>

              {/* Gallery Section */}
              <section className="league-gallery">
                <div className="league-gallery-item">
                  <img src="/assets/football1.jpg" alt="Esports Match 1" />
                  <p>B8 at the World Championship Finals</p>
                </div>
                <div className="league-gallery-item">
                  <img src="/assets/football2.jpg" alt="Esports Match 2" />
                  <p>CS:GO Major Tournament</p>
                </div>
                <div className="league-gallery-item">
                  <img src="/assets/football3.jpg" alt="Esports Match 3" />
                  <p>B8 Gaming Arena Grand Opening</p>
                </div>
              </section>

              {/* Player Widget */}
              <section className="league-player-widget">
                <h3>Player Spotlight</h3>
                <div className="league-player-card">
                  <img src="/assets/player1.jpg" alt="Star Player" />
                  <h4>Alex Chen - Team Captain</h4>
                  <p>K/D Ratio: 2.4 | Tournament Wins: 12 | MVPs: 8</p>
                </div>
              </section>
            </div>
          )}

          {/* Modal */}
          {isModalOpen && (
            <div className="league-modal-overlay" onClick={() => setIsModalOpen(false)}>
              <div className="league-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>B8FC Official Jersey</h2>
                <img src="/assets/football1.jpg" alt="B8 Jersey" />
                <p>High-quality jersey made with breathable fabric, designed for comfort and performance.</p>
                <p>Price: $50</p>
                <button onClick={() => alert('Payment functionality will be integrated soon!')}>Buy Now</button>
                <button className="league-close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
              </div>
            </div>
          )}

          {/* Tournaments List Section */}
          {shouldShowSection('showTournaments') && (
            <section className="tournaments-section">
              <AdminNotice section="showTournaments" name="Tournaments" />
              <h2 className="section-title">Upcoming Tournaments</h2>
              <p className="section-description">
                Join these upcoming {activeSport} tournaments or create your own below.
              </p>
              <TournamentList sportType={activeSport} />
            </section>
          )}

          {/* Tournament Creator Section */}
          {shouldShowSection('showTournamentCreator') && (
            <section className="tournament-creator-section">
              <AdminNotice section="showTournamentCreator" name="Tournament Creator" />
              <h2 className="section-title">Create a Tournament</h2>
              <p className="section-description">
                Organize your own tournament with B8 League. Fill out the form below to get started.
              </p>
              <TournamentCreator sportType={activeSport} />
            </section>
          )}

          {/* Contact Section */}
          {shouldShowSection('showContact') && (
            <section>
              <AdminNotice section="showContact" name="Contact" />
              <ContactForm source="league" />
              
              <SocialChannels className="league-social-channels" />
            </section>
          )}

          {/* Modals */}
          {showCreateTeamModal && <CreateTeamModal />}
          {showScheduleModal && (
            <div className="league-modal-overlay" onClick={() => setShowScheduleModal(false)}>
              <div className="league-modal-content" onClick={e => e.stopPropagation()}>
                <h2>Schedule a Match</h2>
                {/* Add match scheduling form here */}
                <button onClick={() => setShowScheduleModal(false)}>Close</button>
              </div>
            </div>
          )}

          <Footer />
        </div>
      </ComingSoonOverlay>
    </PasswordProtectedPage>
  );
}
