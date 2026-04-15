"use client";

import { useState, useEffect } from 'react';
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Supabase Init
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dsaPlan = [
  { phase: "Phase 1: Mechanics", week: 1, title: "Arrays, Math & Bit Manipulation", focus: "Core aptitude. Modulo arithmetic, prime numbers, XOR operations, and understanding continuous memory layout.", problems: ["Two Sum", "Contains Duplicate", "Missing Number", "Single Number"] },
  { phase: "Phase 1: Mechanics", week: 2, title: "Two Pointers", focus: "Moving from O(N²) loops to O(N) by converging from both sides or moving at different speeds.", problems: ["Valid Palindrome", "3Sum", "Container With Most Water", "Trapping Rain Water"] },
  { phase: "Phase 1: Mechanics", week: 3, title: "Sliding Window", focus: "Maintaining a dynamic 'window' of data over an array to find optimal contiguous subsections.", problems: ["Best Time to Buy and Sell Stock", "Longest Substring Without Repeating Characters", "Longest Repeating Character Replacement"] },
  { phase: "Phase 2: Logic", week: 4, title: "Hash Maps & Sets", focus: "O(1) lookups. Trading space complexity for massive time complexity gains.", problems: ["Valid Anagram", "Group Anagrams", "Top K Frequent Elements", "Longest Consecutive Sequence"] },
  { phase: "Phase 2: Logic", week: 5, title: "Linked Lists", focus: "Pointer manipulation. Focus on the 'Tortoise and Hare' fast/slow pointer concept.", problems: ["Reverse Linked List", "Merge Two Sorted Lists", "Linked List Cycle", "Reorder List"] },
  { phase: "Phase 2: Logic", week: 6, title: "Stacks & Queues", focus: "LIFO logic. Excellent for parsing strings or keeping track of previous states.", problems: ["Valid Parentheses", "Evaluate Reverse Polish Notation", "Min Stack", "Daily Temperatures"] },
  { phase: "Phase 3: Hierarchies", week: 7, title: "Binary Trees & DFS", focus: "Plunging deep into a tree using recursion. Understanding Pre/In/Post-order traversal.", problems: ["Invert Binary Tree", "Maximum Depth of Binary Tree", "Lowest Common Ancestor"] },
  { phase: "Phase 3: Hierarchies", week: 8, title: "Binary Trees & BFS", focus: "Exploring trees layer by layer using a Queue to find shortest paths.", problems: ["Binary Tree Level Order Traversal", "Binary Tree Right Side View"] },
  { phase: "Phase 3: Hierarchies", week: 9, title: "Tries & Heaps", focus: "Advanced structural optimization. Tries for word searches, Heaps for dynamic max/min tracking.", problems: ["Implement Trie", "Kth Largest Element in a Stream", "Merge K Sorted Lists"] },
  { phase: "Phase 4: Mapping", week: 10, title: "Graphs", focus: "Translating real-world connections into an Adjacency List or Matrix.", problems: ["Number of Islands", "Clone Graph", "Course Schedule (Cycle Detection)"] },
  { phase: "Phase 4: Mapping", week: 11, title: "1D Dynamic Programming", focus: "Breaking big problems into cached subproblems. The Check -> Calculate -> Save -> Return pattern.", problems: ["Climbing Stairs", "House Robber", "Coin Change", "Longest Increasing Subsequence"] },
  { phase: "Phase 4: Mapping", week: 12, title: "Backtracking", focus: "Controlled DFS. Building a solution incrementally and 'undoing' the last step if it hits a dead end.", problems: ["Subsets", "Permutations", "Combination Sum", "Word Search"] }
];

export default function Home() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [taskProgress, setTaskProgress] = useState<Record<number, boolean>>({});
  const [notes, setNotes] = useState("");
  const [statusOpacity, setStatusOpacity] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // New States for Features
  const [notesTab, setNotesTab] = useState<'write' | 'preview'>('write');
  const [reviewsNeeded, setReviewsNeeded] = useState<Record<number, boolean>>({});

  const { isLoaded, isSignedIn, userId } = useAuth();

  // Load Data
  useEffect(() => {
    const activeData = dsaPlan.find(w => w.week === activeWeek);
    if (!activeData) return;

    async function loadCloudData() {
      if (!userId) return;
      const { data: taskData } = await supabase.from('user_progress').select('task_index, is_completed').eq('user_id', userId).eq('week_num', activeWeek);
      const cloudTasks: Record<number, boolean> = {};
      taskData?.forEach(row => { cloudTasks[row.task_index] = row.is_completed; });
      setTaskProgress(cloudTasks);

      const { data: notesData } = await supabase.from('user_notes').select('notes_text').eq('user_id', userId).eq('week_num', activeWeek).maybeSingle();
      if (notesData?.notes_text) setNotes(notesData.notes_text);
    }

    if (isSignedIn && userId) loadCloudData();
  }, [activeWeek, isSignedIn, userId]);

  // Autosave Notes
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const savedNote = localStorage.getItem(`w${activeWeek}_notes`) || "";
      if (notes !== savedNote && notes !== "") {
        localStorage.setItem(`w${activeWeek}_notes`, notes);
        if (isSignedIn && userId) {
          await supabase.from('user_notes').upsert({ user_id: userId, week_num: activeWeek, notes_text: notes }, { onConflict: 'user_id, week_num' });
        }
        setStatusOpacity(1);
        setTimeout(() => setStatusOpacity(0), 2000);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [notes, activeWeek, isSignedIn, userId]);

  const toggleTask = async (index: number) => {
    const newVal = !taskProgress[index];
    setTaskProgress(prev => ({ ...prev, [index]: newVal }));
    if (isSignedIn && userId) {
      await supabase.from('user_progress').upsert({ user_id: userId, week_num: activeWeek, task_index: index, is_completed: newVal }, { onConflict: 'user_id, week_num, task_index' });
    }
  };

  const handleSpacedRepetition = (index: number) => {
    setReviewsNeeded(prev => ({ ...prev, [index]: true }));
    alert("Added to Spaced Repetition Engine! We will remind you to re-solve this in 3 days.");
    // In next phase, we save this timestamp to Supabase.
  };

  const activeData = dsaPlan.find(w => w.week === activeWeek);
  const totalTasks = activeData?.problems.length || 0;
  const completedTasks = Object.values(taskProgress).filter(Boolean).length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const groupedPlan = dsaPlan.reduce((acc, curr) => {
    if (!acc[curr.phase]) acc[curr.phase] = [];
    acc[curr.phase].push(curr);
    return acc;
  }, {} as Record<string, typeof dsaPlan>);

  // Mock array for heatmap rendering
  const mockHeatmap = Array.from({ length: 60 }).map((_, i) => Math.floor(Math.random() * 4));

  return (
    <>
      <div className={`overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">Neural Path DSA</div>
        {Object.entries(groupedPlan).map(([phase, weeks]) => (
          <div key={phase}>
            <div className="nav-group">{phase}</div>
            <div className="timeline-container">
              <div className="timeline-line"></div>
              {weeks.map((data) => (
                <div key={data.week} className={`timeline-item ${activeWeek === data.week ? 'active' : ''}`} onClick={() => {setActiveWeek(data.week); setIsMobileMenuOpen(false);}}>
                  <div className="timeline-dot"></div>
                  Week {data.week}: {data.title.split(',')[0]}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="main-content">
        <div className="content-wrapper">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div className="mobile-header" style={{ marginBottom: 0, display: isMobileMenuOpen ? 'none' : '' }}>
              <button className="menu-btn" onClick={() => setIsMobileMenuOpen(true)}>☰ Menu</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: 'auto' }}>
              {!isLoaded ? null : !isSignedIn ? (
                <SignInButton mode="modal"><button className="menu-btn" style={{ background: 'var(--primary)', color: '#000', border: 'none' }}>Sign In</button></SignInButton>
              ) : <UserButton />}
            </div>
          </div>

          {/* --- NEW DASHBOARD GRID --- */}
          <div className="dashboard-grid">
            {/* Heatmap Area */}
            <div className="heatmap-card">
              <div className="section-title" style={{marginBottom: '5px'}}>Consistency Heatmap</div>
              <div style={{fontSize: '12px', color: 'var(--text-dim)'}}>14 Day Streak! Keep building neural pathways.</div>
              <div className="heatmap-grid">
                {mockHeatmap.map((level, i) => (
                  <div key={i} className={`heat-box level-${level}`}></div>
                ))}
              </div>
            </div>

            {/* Social Accountability Feed */}
            <div className="feed-card">
              <div className="section-title">Live Friend Feed</div>
              <div className="feed-item">
                <div className="feed-avatar">S</div>
                <div className="feed-text"><strong>Soham</strong> conquered <em>Two Sum</em>.</div>
              </div>
              <div className="feed-item">
                <div className="feed-avatar" style={{background: 'var(--success)'}}>A</div>
                <div className="feed-text"><strong>Ayush</strong> started <em>Sliding Window</em>.</div>
              </div>
              <div className="feed-item">
                <div className="feed-avatar" style={{background: 'var(--warning)'}}>An</div>
                <div className="feed-text"><strong>Anubhav</strong> is on a 5-day streak!</div>
              </div>
            </div>
          </div>

          <div className="header-badge">WEEK {activeData?.week}</div>
          <h1 className="week-title">{activeData?.title}</h1>
          <p className="week-focus">{activeData?.focus}</p>

          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>

          <div className="section-title">Execution Checklist</div>
          <div className="task-list">
            {activeData?.problems.map((prob, index) => (
              <label key={index} className="task-card">
                <input type="checkbox" className="task-checkbox" checked={taskProgress[index] || false} onChange={() => toggleTask(index)} />
                <span className="task-name">{prob}</span>
                
                {/* Spaced Repetition Button */}
                {!taskProgress[index] && !reviewsNeeded[index] && (
                  <button className="rep-btn" onClick={(e) => { e.preventDefault(); handleSpacedRepetition(index); }}>
                    🧠 Failed - Review in 3 Days
                  </button>
                )}
                {reviewsNeeded[index] && <span style={{marginLeft: 'auto', fontSize: '12px', color: 'var(--warning)'}}>Queued for Review</span>}
              </label>
            ))}
          </div>

          <div className="section-title">Execution Notes & Autopsy</div>
          
          {/* Markdown Editor Tabs */}
          <div className="md-tabs">
            <button className={`md-tab ${notesTab === 'write' ? 'active' : ''}`} onClick={() => setNotesTab('write')}>Write</button>
            <button className={`md-tab ${notesTab === 'preview' ? 'active' : ''}`} onClick={() => setNotesTab('preview')}>Preview Markdown</button>
          </div>

          {notesTab === 'write' ? (
            <textarea 
              className="notes-area" 
              placeholder="Use Markdown here! e.g. **Bold**, `code blocks`, or bullet points..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          ) : (
            <div className="md-preview">
              {notes ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes}</ReactMarkdown>
              ) : (
                <span style={{color: 'var(--text-dim)'}}>Nothing to preview. Start typing...</span>
              )}
            </div>
          )}
          
          <div className="save-status" style={{ opacity: statusOpacity }}>Autosaved to cloud storage ✓</div>
        </div>
      </div>
    </>
  );
}