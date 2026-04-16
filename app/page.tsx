"use client";

import { useState, useEffect } from 'react';
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const curriculumData: Record<string, any[]> = {
  "DSA": [
    { 
      phase: "Phase 1: Mechanics", week: 1, title: "Arrays, Math & Bit Manipulation", focus: "Core aptitude. Modulo arithmetic, prime numbers, XOR operations.", 
      problems: [
        { title: "Two Sum", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum/", description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", hint: "Use a Hash Map to store the required difference as you iterate. O(n) time.", starterCode: "def twoSum(self, nums: List[int], target: int) -> List[int]:\n    pass" },
        { title: "Contains Duplicate", difficulty: "Easy", link: "https://leetcode.com/problems/contains-duplicate/", description: "Return true if any value appears at least twice in the array.", hint: "Convert the list to a set and compare lengths.", starterCode: "def containsDuplicate(self, nums: List[int]) -> bool:\n    pass" },
        { title: "Missing Number", difficulty: "Easy", link: "https://leetcode.com/problems/missing-number/" },
        { title: "Single Number", difficulty: "Easy", link: "https://leetcode.com/problems/single-number/" }
      ] 
    },
    { 
      phase: "Phase 1: Mechanics", week: 30, title: "Two Pointers", focus: "Moving from O(N²) loops to O(N) by converging from both sides.", 
      problems: [
        { title: "Valid Palindrome", difficulty: "Easy", link: "https://leetcode.com/problems/valid-palindrome/", description: "Check if a string is a palindrome, ignoring non-alphanumeric characters.", hint: "Set a left pointer at 0 and right pointer at len(s)-1." },
        { title: "3Sum", difficulty: "Medium", link: "https://leetcode.com/problems/3sum/" },
        { title: "Container With Most Water", difficulty: "Medium", link: "https://leetcode.com/problems/container-with-most-water/" },
        { title: "Trapping Rain Water", difficulty: "Hard", link: "https://leetcode.com/problems/trapping-rain-water/" }
      ] 
    },
    { 
      phase: "Phase 1: Mechanics", week: 3, title: "Sliding Window", focus: "Maintaining a dynamic 'window' of data over an array.", 
      problems: [
        { title: "Best Time to Buy and Sell Stock", difficulty: "Easy", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
        { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
        { title: "Longest Repeating Character Replacement", difficulty: "Medium", link: "https://leetcode.com/problems/longest-repeating-character-replacement/" }
      ] 
    },
    { 
      phase: "Phase 2: Logic", week: 4, title: "Hash Maps & Sets", focus: "O(1) lookups. Trading space complexity for massive time complexity gains.", 
      problems: [
        { title: "Valid Anagram", difficulty: "Easy" },
        { title: "Group Anagrams", difficulty: "Medium" },
        { title: "Top K Frequent Elements", difficulty: "Medium" },
        { title: "Longest Consecutive Sequence", difficulty: "Medium" }
      ] 
    },
    { 
      phase: "Phase 2: Logic", week: 5, title: "Linked Lists", focus: "Pointer manipulation. Focus on the 'Tortoise and Hare' fast/slow pointer concept.", 
      problems: [
        { title: "Reverse Linked List", difficulty: "Easy" },
        { title: "Merge Two Sorted Lists", difficulty: "Easy" },
        { title: "Linked List Cycle", difficulty: "Easy" },
        { title: "Reorder List", difficulty: "Medium" }
      ] 
    },
    { 
      phase: "Phase 2: Logic", week: 6, title: "Stacks & Queues", focus: "LIFO logic. Excellent for parsing strings or keeping track of previous states.", 
      problems: [
        { title: "Valid Parentheses", difficulty: "Easy" },
        { title: "Evaluate Reverse Polish Notation", difficulty: "Medium" },
        { title: "Min Stack", difficulty: "Medium" },
        { title: "Daily Temperatures", difficulty: "Medium" }
      ] 
    },
    { 
      phase: "Phase 3: Hierarchies", week: 7, title: "Binary Trees & DFS", focus: "Plunging deep into a tree using recursion. Pre/In/Post-order traversal.", 
      problems: [
        { title: "Invert Binary Tree", difficulty: "Easy" },
        { title: "Maximum Depth of Binary Tree", difficulty: "Easy" },
        { title: "Lowest Common Ancestor", difficulty: "Medium" }
      ] 
    },
    { 
      phase: "Phase 3: Hierarchies", week: 8, title: "Binary Trees & BFS", focus: "Exploring trees layer by layer using a Queue to find shortest paths.", 
      problems: [
        { title: "Binary Tree Level Order Traversal", difficulty: "Medium" },
        { title: "Binary Tree Right Side View", difficulty: "Medium" }
      ] 
    },
    { 
      phase: "Phase 3: Hierarchies", week: 9, title: "Tries & Heaps", focus: "Advanced structural optimization. Tries for words, Heaps for dynamic max/min.", 
      problems: [
        { title: "Implement Trie", difficulty: "Medium" },
        { title: "Kth Largest Element in a Stream", difficulty: "Easy" },
        { title: "Merge K Sorted Lists", difficulty: "Hard" }
      ] 
    },
    { 
      phase: "Phase 4: Mapping", week: 10, title: "Graphs", focus: "Translating real-world connections into an Adjacency List or Matrix.", 
      problems: [
        { title: "Number of Islands", difficulty: "Medium" },
        { title: "Clone Graph", difficulty: "Medium" },
        { title: "Course Schedule", difficulty: "Medium" }
      ] 
    },
    { 
      phase: "Phase 4: Mapping", week: 11, title: "1D Dynamic Programming", focus: "Breaking big problems into cached subproblems. Check -> Calc -> Save.", 
      problems: [
        { title: "Climbing Stairs", difficulty: "Easy" },
        { title: "House Robber", difficulty: "Medium" },
        { title: "Coin Change", difficulty: "Medium" },
        { title: "Longest Increasing Subsequence", difficulty: "Medium" }
      ] 
    },
    { 
      phase: "Phase 4: Mapping", week: 12, title: "Backtracking", focus: "Controlled DFS. Building incrementally and 'undoing' the last step.", 
      problems: [
        { title: "Subsets", difficulty: "Medium" },
        { title: "Permutations", difficulty: "Medium" },
        { title: "Combination Sum", difficulty: "Medium" },
        { title: "Word Search", difficulty: "Medium" }
      ] 
    }
  ],
  "AI / ML": [
    { 
      phase: "Phase 1: Foundations", week: 1, title: "Linear Algebra & NumPy", focus: "Vectors, matrices, and broadcasting in Python.", 
      problems: [
        { title: "Matrix Multiplication", difficulty: "Easy" },
        { title: "Broadcasting Rules", difficulty: "Medium" }
      ] 
    }
  ],
  "Web Dev": [
    { 
      phase: "Phase 1: Frontend", week: 1, title: "React Fundamentals", focus: "Components, Props, and State.", 
      problems: [
        { title: "Build a Counter", difficulty: "Easy" },
        { title: "Pass Props Down", difficulty: "Easy" }
      ] 
    }
  ]
};

const courses = Object.keys(curriculumData);

export default function Home() {
  const [activeCourse, setActiveCourse] = useState(courses[0]);
  const [activeWeek, setActiveWeek] = useState(1);
  const [taskProgress, setTaskProgress] = useState<Record<number, boolean>>({});
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [statusOpacity, setStatusOpacity] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [notesTab, setNotesTab] = useState<'write' | 'preview'>('write');
  const [reviewsNeeded, setReviewsNeeded] = useState<Record<number, boolean>>({});
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const { isLoaded, isSignedIn, userId } = useAuth();

  const currentPlan = curriculumData[activeCourse] || curriculumData["DSA"];
  const activeData = currentPlan.find(w => w.week === activeWeek) || currentPlan[0];

  const handleCourseSwitch = (course: string) => {
    setActiveCourse(course);
    setActiveWeek(1);
    setExpandedTask(null);
    setNotes("");
    setTaskProgress({});
  };

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('dsa-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    window.localStorage.setItem('dsa-theme', theme);
  }, [theme]);

  const getProblemConcepts = (title: string) => {
    const normalized = title.toLowerCase();
    const topics: Record<string, string[]> = {
      'two sum': ['Hash map lookup', 'Array traversal', 'Complement search', 'Two-pointer setup', 'Index pairing'],
      'contains duplicate': ['Hash set', 'Duplicate detection', 'O(n) time', 'Data validation', 'Frequency counting'],
      'missing number': ['Arithmetic series', 'XOR trick', 'Set difference', 'Index sums', 'Missing element patterns'],
      'single number': ['XOR gates', 'Bitwise cancelation', 'Linear scan', 'Parity reasoning'],
      'valid palindrome': ['Two pointers', 'String normalization', 'Alphanumeric filtering', 'Case folding'],
      '3sum': ['Sorting + two pointers', 'Duplicate skipping', 'Triplet combination', 'Array partitioning'],
      'container with most water': ['Two-pointer technique', 'Greedy width-height', 'Max area', 'Array boundaries'],
      'trapping rain water': ['Water volume', 'Two pointers', 'Stack / elevation logic', 'Height profiling'],
      'valid anagram': ['Character counts', 'Hash maps', 'String comparison', 'Frequency maps'],
      'group anagrams': ['Signature sorting', 'Hash map grouping', 'String buckets', 'Canonical forms'],
      'top k frequent elements': ['Frequency map', 'Min-heap', 'Bucket sort', 'Counting frequencies'],
      'longest consecutive sequence': ['Hash set lookup', 'Sequence expansion', 'O(n) scanning', 'Consecutive runs'],
      'reverse linked list': ['Pointer reversal', 'Iterative vs recursive', 'In-place transform', 'Node linking'],
      'merge two sorted lists': ['Dummy node pattern', 'Sorted merge', 'List traversal', 'Two-list merge'],
      'linked list cycle': ['Fast/slow pointers', 'Cycle detection', 'Floyd’s algorithm', 'Linked list visitation'],
      'valid parentheses': ['Stack usage', 'Matching pairs', 'Syntax validation', 'Bracket nesting'],
      'evaluate reverse polish notation': ['Stack evaluation', 'Operator order', 'Postfix notation', 'Expression parsing'],
      'min stack': ['Auxiliary stack', 'Constant time min', 'Stack invariants', 'Space tracking'],
      'daily temperatures': ['Monotonic stack', 'Next greater element', 'Temperature span', 'Future lookup'],
      'invert binary tree': ['Recursion', 'Swap children', 'DFS traversal', 'Tree symmetry'],
      'maximum depth of binary tree': ['Tree height', 'DFS / BFS', 'Recursive depth', 'Level counting'],
      'lowest common ancestor': ['Binary tree traversal', 'Path comparison', 'Divide and conquer', 'Ancestor tracking'],
      'binary tree level order traversal': ['BFS queue', 'Layer-by-layer', 'Tree levels', 'Breadth-first search'],
      'binary tree right side view': ['Level order', 'Visibility by depth', 'Queue processing', 'Right-side projection'],
      'implement trie': ['Prefix tree', 'Trie nodes', 'Character branching', 'String prefixes'],
      'kth largest element in a stream': ['Heaps', 'Sliding window', 'Stream processing', 'Online selection'],
      'merge k sorted lists': ['Divide and conquer', 'Heap merge', 'Linked list merge', 'Multiple list merge'],
      'number of islands': ['DFS / BFS', 'Grid traversal', 'Connected components', 'Flood fill'],
      'clone graph': ['Graph traversal', 'DFS/BFS', 'Deep copy', 'Node cloning'],
      'course schedule': ['Topological sort', 'DAG', 'Dependency graph', 'Order constraints'],
      'climbing stairs': ['Fibonacci sequence', 'Dynamic programming', 'State transitions', 'Step recursion'],
      'house robber': ['DP with constraints', 'Choose vs skip', 'Optimal substructure', 'Adjacent choices'],
      'coin change': ['Unbounded knapsack', 'DP tabulation', 'Subproblem reuse', 'Combination sums'],
      'longest increasing subsequence': ['Patience sorting', 'DP + binary search', 'Subsequence tracking', 'Sequence optimization'],
      'subsets': ['Backtracking', 'Bit masking', 'Subset generation', 'Combination enumeration'],
      'permutations': ['DFS recursion', 'Swap technique', 'Backtracking', 'Order generation'],
      'combination sum': ['Backtracking', 'Sum pruning', 'Sorted candidates', 'Target decomposition'],
      'word search': ['DFS grid search', 'Visited tracking', 'Prefix pruning', 'Board traversal'],
      'matrix multiplication': ['2D arrays', 'Row/column iteration', 'Dot product', 'Matrix arithmetic'],
      'broadcasting rules': ['Numpy broadcasting', 'Shape alignment', 'Element-wise ops', 'Array expansion'],
      'build a counter': ['React state', 'Event handling', 'Component updates', 'UI interactivity'],
      'pass props down': ['React props', 'Component hierarchy', 'Data flow', 'Reusable UI components'],
      'array': ['Array fundamentals', 'Indexing', 'Iteration patterns', 'Subarray thinking', 'In-place modifications'],
      'string': ['String traversal', 'Substring matching', 'Character encoding', 'Normalization', 'Two-pointer strings'],
      'graph': ['Adjacency lists', 'BFS / DFS', 'Weights vs unweighted', 'Cycle detection'],
      'tree': ['Rooted trees', 'DFS / BFS', 'Recursive traversal', 'Height and depth'],
      'linked list': ['Node pointers', 'Head/tail handling', 'In-place reversal', 'Cycle detection'],
      'stack': ['LIFO structure', 'Push/pop', 'Expression evaluation', 'Monotonic patterns'],
      'queue': ['FIFO structure', 'Level order', 'Sliding window', 'Buffering'],
      'heap': ['Priority queues', 'Heapify', 'Kth element', 'Min/max access'],
      'dynamic programming': ['Memoization', 'Tabulation', 'State definition', 'Overlapping subproblems'],
      'backtracking': ['Recursive search', 'Pruning', 'Constraint propagation', 'Path exploration']
    };

    return Object.entries(topics).find(([key]) => normalized.includes(key))?.[1] || ['Array fundamentals', 'Pattern recognition', 'Time/space tradeoffs', 'Edge case handling'];
  };

  const getConceptTheory = (concept: string) => {
    const key = concept.toLowerCase();
    const theory: Record<string, string> = {
      'hash map lookup': 'A hash map stores key-value pairs and allows fast lookup by key. Use it for constant-time membership checks and to track counts or complements in arrays.',
      'array traversal': 'Traversing an array means visiting each element sequentially. It is the foundation for searching, filtering, and applying operations over list data.',
      'complement search': 'Complement search finds a matching element by calculating the difference between a target and the current item. It is common in sum problems like Two Sum.',
      'two-pointer setup': 'Two pointers use two indices moving through an array from different ends or directions. This technique optimizes problems involving sorted arrays or pair sums.',
      'index pairing': 'Index pairing means keeping track of array indices as you compare or combine values. It is useful when you must return positions, not just values.',
      'hash set': 'A hash set stores unique values with fast insert and lookup. It is perfect for duplicate checks and membership testing in O(1) average time.',
      'duplicate detection': 'Detecting duplicates means checking whether any value appears more than once. Sets or hash maps are usually the most efficient tools for this.',
      'o(n) time': 'O(n) time means the algorithm scales linearly with input size. One pass over the array is a common goal for efficient solutions.',
      'arithmetic series': 'An arithmetic series is a sequence where each term differs by a constant amount. Use its formula to compute sums quickly without iterating all elements.',
      'xor trick': 'The XOR trick uses bitwise XOR to cancel duplicate values. It is useful for finding a single unique number when duplicates otherwise mask the answer.',
      'set difference': 'Set difference compares two sets to find missing or extra elements. It is useful for problems that ask for the absent value in a range.',
      'xor gates': 'XOR is a bitwise operator that returns true when inputs differ. In algorithms, it helps detect unique items and perform parity checks efficiently.',
      'bitwise cancelation': 'Bitwise cancelation uses XOR to remove paired values from consideration, leaving only unmatched ones behind.',
      'linear scan': 'A linear scan visits each element once. It is simple and efficient for problems where relative order matters or a single pass yields the result.',
      'two pointers': 'The two-pointer technique uses two indices in one or two arrays to solve problems faster than nested loops, often in linear time.',
      'string normalization': 'String normalization cleans input by converting case and removing non-alphanumeric characters, which is essential for robust string comparisons.',
      'alphanumeric filtering': 'Alphanumeric filtering removes all characters except letters and digits, simplifying palindrome checks and comparisons.',
      'sorting + two pointers': 'Combine sorting with two pointers to reduce a quadratic search into a linear scan over a sorted array. This is very effective for sum and pair problems.',
      'duplicate skipping': 'When scanning sorted data, skip repeated values to avoid duplicate results. This keeps output unique and improves performance.',
      'triplet combination': 'Triplet combination finds three elements that satisfy a condition. It often uses nested loops with pointer movement to avoid brute force.',
      'two-pointer technique': 'Two pointers move through the array from each end and meet in the middle. It is ideal for maximizing or pairing values in sorted lists.',
      'greedy width-height': 'Greedy width-height chooses the best local pair of values for an immediate result, like evaluating containers based on current width and height.',
      'max area': 'Max area problems compute the largest contained value based on dimensions and constraints, often using geometry with array endpoints.',
      'water volume': 'Water volume problems measure trapped capacity between barriers. Use height differences and boundary scanning to compute retained units efficiently.',
      'stack / elevation logic': 'Stack methods track rising and falling heights, typically used to calculate how much space water can fill between boundaries.',
      'height profiling': 'Height profiling maps elevation values across an array to determine local peaks and valleys for volume or span calculations.',
      'character counts': 'Character counting tallies how often each symbol appears. It is essential for anagram checks and frequency-based comparisons.',
      'hash maps': 'Hash maps map keys to values with average constant-time access, making them perfect for frequency tracking and grouping tasks.',
      'string comparison': 'String comparison tests whether two strings match exactly or after normalization, and is the core of anagram and palindrome problems.',
      'signature sorting': 'Signature sorting converts strings into canonical forms, such as sorted characters, to group similar items together easily.',
      'hash map grouping': 'Grouping by hash map means using a key derived from each element to collect related items under the same bucket.',
      'string buckets': 'String buckets categorize words by attributes like sorted letters or character frequency, enabling fast grouping of anagrams.',
      'frequency map': 'A frequency map records how often each value appears. It is useful for finding top elements and performing weighted decisions.',
      'min-heap': 'A min-heap is a priority queue that always surfaces the smallest item. Use it to maintain the top K largest items efficiently.',
      'bucket sort': 'Bucket sort groups values into ranges before sorting each bucket. It is effective when values fall into a predictable distribution.',
      'sequence expansion': 'Sequence expansion explores consecutive values from a starting point to find the longest run or stretch in a set.',
      'consecutive runs': 'Consecutive runs are sequences of back-to-back values. Detecting them quickly often depends on constant-time membership checks.',
      'pointer reversal': 'Pointer reversal rewires linked list next pointers so the list direction is reversed while scanning it once.',
      'iterative vs recursive': 'Iterative methods use loops, while recursive methods call themselves. Both can solve linked list and tree problems with different memory patterns.',
      'in-place transform': 'In-place transformation modifies a structure without allocating extra copies, keeping memory usage low.',
      'dummy node pattern': 'A dummy node simplifies list merging by providing a stable starting point, avoiding special cases for the head element.',
      'sorted merge': 'Sorted merge combines two sorted lists by selecting the next smallest current item from either list.',
      'list traversal': 'List traversal moves through each node sequentially, allowing comparisons and operations at each element.',
      'fast/slow pointers': 'Fast and slow pointers move through a list at different speeds to detect cycles or find middle elements efficiently.',
      'cycle detection': 'Cycle detection determines whether a linked structure loops back on itself, often using pointer techniques like Floyd’s algorithm.',
      'floyd’s algorithm': 'Floyd’s algorithm uses two pointers at different speeds to detect loops without extra memory.',
      'stack usage': 'Stacks store data in last-in, first-out order. They are useful for parsing expressions and matching nested delimiters.',
      'matching pairs': 'Matching pairs identifies correctly nested opening and closing symbols, central to parentheses validation.',
      'syntax validation': 'Syntax validation checks whether input follows correct structural rules, such as balanced brackets and proper order.',
      'stack evaluation': 'Stack evaluation processes expressions by pushing values and operators, frequently used for postfix calculations.',
      'operator order': 'Operator order defines how arithmetic and logical operations are grouped. In postfix form, order is explicit by operand position.',
      'postfix notation': 'Postfix notation puts operators after their operands, removing the need for parentheses and simplifying evaluation.',
      'auxiliary stack': 'An auxiliary stack keeps additional state, such as minimum values, to support extended stack operations in constant time.',
      'constant time min': 'Constant time min ensures retrieving the smallest item does not require scanning the whole stack, by storing the current minimum separately.',
      'stack invariants': 'Stack invariants are rules that remain true after each operation, such as maintaining an auxiliary structure for minimum tracking.',
      'monotonic stack': 'A monotonic stack stores elements in increasing or decreasing order, making it easy to answer next-greater or next-smaller queries.',
      'next greater element': 'The next greater element problem finds the nearest future value larger than the current one, often solved with a stack.',
      'temperature span': 'Temperature span measures how many days until a warmer temperature occurs, and is solved by tracking future warmer values.',
      'recursion': 'Recursion solves a problem by calling the same function on smaller inputs. It is common in tree traversals and divide-and-conquer algorithms.',
      'swap children': 'Swapping children exchanges left and right subtrees to invert a binary tree structure.',
      'dfs traversal': 'DFS traversal explores a tree by visiting a node, then recursively exploring each child branch before backtracking.',
      'tree symmetry': 'Tree symmetry checks whether left and right subtrees mirror each other in structure and values.',
      'tree height': 'Tree height is the longest path from root to leaf, found by exploring both subtrees recursively or with breadth-first search.',
      'dfs / bfs': 'DFS and BFS are tree traversal strategies. DFS goes deep along branches first, while BFS visits nodes level by level.',
      'recursive depth': 'Recursive depth measures how far recursion descends, and is important for stack usage and base case design.',
      'binary tree traversal': 'Binary tree traversal visits every node in a tree using DFS or BFS approaches to inspect or compute values.',
      'path comparison': 'Path comparison checks the routes from root to nodes, useful for identifying shared ancestors or validating structure.',
      'divide and conquer': 'Divide and conquer breaks a problem into smaller parts, solves them independently, and combines the results.',
      'ancestor tracking': 'Ancestor tracking follows tree paths to determine common predecessors, often by storing visited nodes or recursive returns.',
      'bfs queue': 'BFS uses a queue to visit nodes in level order, processing each layer of the tree before moving deeper.',
      'layer-by-layer': 'Layer-by-layer traversal processes nodes one depth level at a time, which is useful for breadth-first search and visibility problems.',
      'tree levels': 'Tree levels group nodes by depth. Counting or visiting each level reveals the structure and breadth of the tree.',
      'level order': 'Level order traversal visits nodes by depth, often implemented with a queue to maintain the current frontier.',
      'visibility by depth': 'Visibility by depth identifies which nodes are visible from one side by considering the deepest nodes at each level.',
      'queue processing': 'Queue processing uses FIFO order to manage which nodes or values are handled next in breadth-first operations.',
      'right-side projection': 'Right-side projection determines the node seen from the right side of a tree by selecting the last visible node at each depth.',
      'prefix tree': 'A prefix tree, or trie, stores words by shared prefixes. Each node represents a character and paths form complete keys.',
      'trie nodes': 'Trie nodes represent characters and link to children nodes, enabling fast prefix searches and autocomplete.',
      'character branching': 'Character branching means each trie node can have multiple character children, representing different continuations of a prefix.',
      'heaps': 'Heaps are tree-backed structures that keep the max or min element at the root, supporting efficient top-k operations.',
      'sliding window': 'Sliding window moves a fixed-size window across data to compute results over subsequences without repeated scanning.',
      'stream processing': 'Stream processing handles data incrementally as it arrives, often with limited memory and one-pass algorithms.',
      'online selection': 'Online selection chooses values from a stream as they come, without knowing future inputs, often with heaps or order statistics.',
      'heap merge': 'Heap merge combines sorted lists by pushing current candidates into a heap and extracting the next smallest item repeatedly.',
      'multiple list merge': 'Multiple list merge generalizes pairwise merging to handle many sorted inputs efficiently.',
      'grid traversal': 'Grid traversal visits each cell in a matrix, often using DFS or BFS to explore connected regions and boundaries.',
      'connected components': 'Connected components are groups of nodes reachable from each other. Identifying them is key to graph and grid problems.',
      'flood fill': 'Flood fill spreads from a starting cell to fill connected areas, similar to coloring regions in a grid or image.',
      'graph traversal': 'Graph traversal visits every reachable node, often using BFS or DFS to explore edges and discover structure.',
      'deep copy': 'Deep copy duplicates a structure and its nested objects rather than sharing references, ensuring changes do not affect the original.',
      'node cloning': 'Node cloning copies each node and its connections in a graph or tree, preserving structure while creating a separate instance.',
      'topological sort': 'Topological sort orders nodes in a directed acyclic graph so every edge points from earlier to later nodes.',
      'dag': 'A directed acyclic graph is a graph with no cycles, often used to model dependencies and scheduling.',
      'dependency graph': 'A dependency graph shows prerequisites and ordering constraints, helping plan tasks or detect impossible conditions.',
      'fibonacci sequence': 'The Fibonacci sequence is defined by adding the two previous numbers. It appears naturally in recursive and DP problems.',
      'dynamic programming': 'Dynamic programming solves complex problems by reusing solutions to overlapping subproblems, storing results in memory.',
      'state transitions': 'State transitions describe how one problem state moves to the next, which is central to DP formulation and memoization.',
      'step recursion': 'Step recursion solves stair-climbing problems by expressing the current state in terms of previous steps and base cases.',
      'dp with constraints': 'DP with constraints chooses whether to include or exclude items while respecting rules, such as avoiding adjacent selections.',
      'choose vs skip': 'Choose vs skip compares the result of taking or ignoring an element, a common pattern in DP and greedy decisions.',
      'optimal substructure': 'Optimal substructure means the best solution can be built from best subsolutions, a key property in DP.',
      'unbounded knapsack': 'Unbounded knapsack allows repeated use of items while maximizing value or minimizing cost, solved with DP.',
      'dp tabulation': 'DP tabulation fills a table iteratively from simple cases to the full solution, often using loops over dimensions.',
      'subproblem reuse': 'Subproblem reuse stores previously solved states so they can be reused instead of recomputed.',
      'patience sorting': 'Patience sorting builds piles of cards to find the longest increasing subsequence efficiently using binary search.',
      'dp + binary search': 'DP combined with binary search speeds up subsequence problems by finding where to extend candidate sequences.',
      'subsequence tracking': 'Subsequence tracking records potential subsequences and updates them as new values arrive.',
      'backtracking': 'Backtracking explores choices recursively and retracts them when they lead to invalid or suboptimal results.',
      'bit masking': 'Bit masking uses binary bits to represent subsets compactly, enabling efficient enumeration over combinations.',
      'subset generation': 'Subset generation systematically creates all possible subsets of a set, often by recursion or bit patterns.',
      'dfs recursion': 'DFS recursion explores a search space by recursively visiting candidates and backtracking after each path.',
      'swap technique': 'The swap technique generates permutations in place by swapping elements and then recursing on the remainder.',
      'order generation': 'Order generation creates sequences in every possible order, often using recursion and swap or insertion steps.',
      'sum pruning': 'Sum pruning cuts off search paths early when the partial sum already exceeds the target, improving backtracking efficiency.',
      'sorted candidates': 'Sorted candidates make pruning easier because you can stop searching once values become too large for the target.',
      'target decomposition': 'Target decomposition breaks the desired sum into smaller parts and explores combinations that build toward it.',
      'board traversal': 'Board traversal searches a 2D grid by moving through adjacent cells while tracking visited positions.',
      'visited tracking': 'Visited tracking prevents infinite loops by marking cells or nodes already explored.',
      'prefix pruning': 'Prefix pruning stops exploration early when the current partial solution cannot lead to the target, based on string prefixes or patterns.',
      'array fundamentals': 'An array stores items in contiguous memory with indexed access. It is a fundamental structure for lists, searching, and iteration.',
      'indexing': 'Indexing accesses elements by position in a sequence. Zero-based indexing is common in most languages.',
      'iteration patterns': 'Iteration patterns include for-loops, while-loops, and built-in iteration methods that traverse arrays or collections.',
      'subarray thinking': 'Subarray thinking focuses on a contiguous portion of an array, often used in sliding window and range problems.',
      'in-place modifications': 'In-place modification updates data inside the original structure, saving memory by avoiding extra copies.',
      'string traversal': 'String traversal visits each character in order. It is essential for parsing, searching, and transformation tasks.',
      'substring matching': 'Substring matching finds one string inside another, which is fundamental to search and text-processing problems.',
      'character encoding': 'Character encoding defines how characters are represented in bytes. It matters for comparing and manipulating text data.',
      'normalization': 'Normalization converts text to a consistent case or form so comparisons behave predictably.',
      'two-pointer strings': 'Two-pointer string techniques use two indices to compare or process characters from both ends or within a window.',
      'adjacency lists': 'Adjacency lists store each graph node with a list of its neighbors, making graph traversal efficient for sparse graphs.',
      'weights vs unweighted': 'Weighted graphs assign values to edges, while unweighted graphs treat all edges equally; this affects path selection methods.',
      'rooted trees': 'Rooted trees have a designated root node. Traversal algorithms commonly start at the root and visit children recursively.',
      'node pointers': 'Node pointers link elements in linked lists by storing the next node reference, enabling linear dynamic structures.',
      'head/tail handling': 'Head and tail handling manages the first and last nodes in a linked list, especially for insertion and deletion operations.',
      'in-place reversal': 'In-place reversal flips a list by rewiring pointers without allocating extra nodes.',
      'bracket nesting': 'Bracket nesting describes properly matched opening and closing symbols in expressions and structured text.',
      'expression parsing': 'Expression parsing analyzes text into values and operators so a program can evaluate or transform it.',
      'element-wise ops': 'Element-wise operations apply the same operation to each element in arrays of compatible shape, common in math libraries.',
      'shape alignment': 'Shape alignment adjusts array dimensions so operations can broadcast across compatible sizes.',
      'array expansion': 'Array expansion extends a smaller array to match another array’s shape during a broadcast operation.',
      'component updates': 'Component updates refresh UI elements when state changes, a core concept in reactive frameworks like React.',
      'data flow': 'Data flow describes how information moves through components, from parent to child, often via props or state.',
      'reusable ui components': 'Reusable UI components are modular pieces of interface logic that can be composed and reused across screens.'
    };

    return theory[key] || 'This concept is a core idea for the problem. Study the definition, examples, and how it applies to arrays and algorithm design.';
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (!activeData) return;
    async function loadCloudData() {
      if (!userId) return;
      const { data: taskData } = await supabase.from('user_progress').select('task_index, is_completed').eq('user_id', userId).eq('course_name', activeCourse).eq('week_num', activeWeek);
      const cloudTasks: Record<number, boolean> = {};
      taskData?.forEach(row => { cloudTasks[row.task_index] = row.is_completed; });
      setTaskProgress(cloudTasks);

      const { data: notesData } = await supabase.from('user_notes').select('notes_text').eq('user_id', userId).eq('course_name', activeCourse).eq('week_num', activeWeek).maybeSingle();
      if (notesData?.notes_text) setNotes(notesData.notes_text);
    }
    if (isSignedIn && userId) loadCloudData();
  }, [activeWeek, activeCourse, isSignedIn, userId]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const localKey = `${activeCourse}_w${activeWeek}_notes`;
      const savedNote = localStorage.getItem(localKey) || "";
      if (notes !== savedNote && notes !== "") {
        localStorage.setItem(localKey, notes);
        if (isSignedIn && userId) {
          await supabase.from('user_notes').upsert({ user_id: userId, course_name: activeCourse, week_num: activeWeek, notes_text: notes }, { onConflict: 'user_id, course_name, week_num' });
        }
        setStatusOpacity(1);
        setTimeout(() => setStatusOpacity(0), 2000);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [notes, activeWeek, activeCourse, isSignedIn, userId]);

  const toggleTask = async (index: number) => {
    const newVal = !taskProgress[index];
    setTaskProgress(prev => ({ ...prev, [index]: newVal }));
    if (isSignedIn && userId) {
      await supabase.from('user_progress').upsert({ user_id: userId, course_name: activeCourse, week_num: activeWeek, task_index: index, is_completed: newVal }, { onConflict: 'user_id, course_name, week_num, task_index' });
    }
  };

  const handleSpacedRepetition = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setReviewsNeeded(prev => ({ ...prev, [index]: true }));
    alert("Added to Spaced Repetition Engine! We will remind you to re-solve this in 3 days.");
  };

  const totalTasks = activeData?.problems.length || 0;
  const completedTasks = Object.values(taskProgress).filter(Boolean).length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const groupedPlan = currentPlan.reduce((acc: any, curr: any) => {
    if (!acc[curr.phase]) acc[curr.phase] = [];
    acc[curr.phase].push(curr);
    return acc;
  }, {} as Record<string, any[]>);

  const mockHeatmap = [0, 1, 0, 2, 1, 3, 0, 0, 1, 2, 3, 2, 1, 0, 1, 2, 0, 0, 1, 3, 2, 1, 0, 2, 3, 1, 0, 1, 2, 0, 1, 3, 2, 0, 1, 2, 1, 0, 3, 2, 1, 0, 0, 1, 2, 3, 1, 0, 1, 2, 0, 1, 2, 3, 2, 1, 0, 1, 2, 0];

  return (
    <div className="app-container">
      <div className="top-slider">
        {courses.map(course => (
          <div key={course} className={`course-tab ${activeCourse === course ? 'active' : ''}`} onClick={() => handleCourseSwitch(course)}>
            {course}
          </div>
        ))}
        <div className="top-slider-controls">
          <button type="button" className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          {!isLoaded ? null : !isSignedIn ? (
            <SignInButton mode="modal"><button className="menu-btn" style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '6px 12px' }}>Sign In</button></SignInButton>
          ) : <UserButton />}
        </div>
      </div>

      <div className="workspace">
        <div className={`overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

        <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="sidebar-header">{activeCourse} PATH</div>
          {Object.entries(groupedPlan).map(([phase, weeks]: any) => (
            <div key={phase}>
              <div className="nav-group">{phase}</div>
              <div className="timeline-container">
                <div className="timeline-line"></div>
                {weeks.map((data: any) => (
                  <div key={data.week} className={`timeline-item ${activeWeek === data.week ? 'active' : ''}`} onClick={() => {setActiveWeek(data.week); setExpandedTask(null); setIsMobileMenuOpen(false);}}>
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
            <div className="mobile-header" style={{ marginBottom: '20px', display: isMobileMenuOpen ? 'none' : '' }}>
              <button className="menu-btn" onClick={() => setIsMobileMenuOpen(true)}>☰ Menu</button>
            </div>

            <div className="dashboard-grid">
              <div className="heatmap-card">
                <div className="section-title" style={{marginBottom: '5px'}}>Consistency Heatmap</div>
                <div style={{fontSize: '12px', color: 'var(--text-dim)'}}>14 Day Streak! Keep building neural pathways.</div>
                <div className="heatmap-grid">
                  {mockHeatmap.map((level, i) => <div key={i} className={`heat-box level-${level}`}></div>)}
                </div>
              </div>
              <div className="feed-card">
                <div className="section-title">Live Friend Feed</div>
                <div className="feed-item"><div className="feed-avatar">S</div><div className="feed-text"><strong>Soham</strong> conquered <em>Two Sum</em>.</div></div>
                <div className="feed-item"><div className="feed-avatar" style={{background: 'var(--success)'}}>A</div><div className="feed-text"><strong>Ayush</strong> started <em>Sliding Window</em>.</div></div>
              </div>
            </div>

            <div className="header-badge">WEEK {activeData?.week}</div>
            <h1 className="week-title">{activeData?.title}</h1>
            <p className="week-focus">{activeData?.focus}</p>

            <div className="progress-container">
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>

            <div className="section-title">Execution Modules</div>
            <div className="task-list">
              
              {activeData?.problems.map((prob: any, index: number) => (
                <div key={index} className="task-wrapper">
                  
                  <div className="task-header-row" onClick={() => setExpandedTask(expandedTask === index ? null : index)}>
                    <input 
                      type="checkbox" 
                      className="task-checkbox" 
                      checked={taskProgress[index] || false} 
                      onChange={(e) => { e.stopPropagation(); toggleTask(index); }} 
                    />
                    
                    <div className="task-info-group">
                      <span className="task-name" style={{ textDecoration: taskProgress[index] ? 'line-through' : 'none', color: taskProgress[index] ? 'var(--text-dim)' : '#fff' }}>
                        {prob.title}
                      </span>
                      {prob.difficulty && (
                        <span className={`difficulty-badge diff-${prob.difficulty.toLowerCase()}`}>
                          {prob.difficulty}
                        </span>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        className="learn-more-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedTask(index);
                        }}
                      >
                        📘 Learn more
                      </button>
                      {!taskProgress[index] && !reviewsNeeded[index] && (
                        <button className="rep-btn" onClick={(e) => handleSpacedRepetition(e, index)}>🧠 Review Later</button>
                      )}
                      {reviewsNeeded[index] && <span style={{fontSize: '12px', color: 'var(--warning)'}}>Queued</span>}
                    </div>
                  </div>

                  {expandedTask === index && (
                    <div className="task-details-drawer">
                      
                      {prob.description && (
                        <div>
                          <div className="detail-section-title">Mission Briefing</div>
                          <div className="problem-desc">{prob.description}</div>
                        </div>
                      )}

                      {prob.hint && (
                        <div className="hint-box"><strong>💡 Neural Hint:</strong> {prob.hint}</div>
                      )}

                      {prob.starterCode && (
                        <div>
                          <div className="detail-section-title">Starter Template</div>
                          <div className="code-snippet">{prob.starterCode}</div>
                        </div>
                      )}

                      <div className="detail-section-title">Learn More</div>
                      <div className="learn-more-list">
                        {getProblemConcepts(prob.title).map((concept) => (
                          <button key={concept} type="button" className="learn-more-chip" onClick={(e) => { e.stopPropagation(); setSelectedConcept(concept); }}>
                            {concept}
                          </button>
                        ))}
                      </div>

                      {prob.link ? (
                        <div className="action-bar">
                          <a href={prob.link} target="_blank" rel="noopener noreferrer" className="solve-btn">
                            Solve on LeetCode ↗
                          </a>
                        </div>
                      ) : (
                         <div style={{fontSize: '12px', color: 'var(--text-dim)'}}>
                           (No LeetCode link provided for this challenge yet)
                         </div>
                      )}

                    </div>
                  )}

                </div>
              ))}
            </div>

            <div className="section-title">Execution Notes & Autopsy</div>
            <div className="md-tabs">
              <button className={`md-tab ${notesTab === 'write' ? 'active' : ''}`} onClick={() => setNotesTab('write')}>Write</button>
              <button className={`md-tab ${notesTab === 'preview' ? 'active' : ''}`} onClick={() => setNotesTab('preview')}>Preview Markdown</button>
            </div>
            {notesTab === 'write' ? (
              <textarea className="notes-area" placeholder="Use Markdown here! e.g. **Bold**, `code blocks`, or bullet points..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            ) : (
              <div className="md-preview">{notes ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes}</ReactMarkdown> : <span style={{color: 'var(--text-dim)'}}>Nothing to preview. Start typing...</span>}</div>
            )}
            <div className="save-status" style={{ opacity: statusOpacity }}>Autosaved to cloud storage ✓</div>
          </div>
        </div>
        <div className={`theory-panel ${selectedConcept ? 'open' : ''}`}>
          <div className="theory-panel-header">
            <div>Theory</div>
            <button type="button" className="panel-close-btn" onClick={() => setSelectedConcept(null)}>✕</button>
          </div>
          <div className="theory-panel-body">
            <div className="theory-panel-title">{selectedConcept || 'Pick a concept'}</div>
            <p>{selectedConcept ? getConceptTheory(selectedConcept) : 'Select any concept chip to view theory from the right side.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}