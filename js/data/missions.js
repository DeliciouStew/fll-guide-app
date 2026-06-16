const MISSIONS = [
  { id:1,  name:'Surface Brushing',   pts:30, px:16.5, py:42.5, img:null,
    tips:['Soil deposits completely cleared & touching mat: 10 pts each', "Archaeologist's brush not touching dig site: 10 pts", 'Max 30 pts total — clear all 2 soil deposits + brush condition'] },
  { id:2,  name:'Map Reveal',          pts:20, px:20.5, py:16.5, img:null,
    tips:['Topsoil sections completely cleared: 10 pts each', '2 topsoil sections = max 20 pts', 'Shift and remove topsoil to reveal the hidden map'] },
  { id:3,  name:'Mineshaft Explorer',  pts:40, px:37.5, py:11.5, img:null,
    tips:["Minecart on opposing team's field: 30 pts", "Bonus +10 if opposing team's minecart is on your field", 'Cart must pass COMPLETELY through the mineshaft entry', 'Bonus not available in remote competitions'] },
  { id:4,  name:'Careful Recovery',    pts:40, px:33.5, py:22.0, img:null,
    tips:['Precious artifact not touching the mine: 30 pts', 'Both support structures standing: 10 pts', 'Slow and precise — rushing causes drops'] },
  { id:5,  name:'Who Lived Here?',     pts:30, px:73.5, py:13.5, img:null,
    tips:['Structure floor completely upright: 30 pts', 'One clean push motion usually works', 'Verify floor is fully level after the action'] },
  { id:6,  name:'Forge',               pts:30, px:82.0, py:23.5, img:null,
    tips:['Ore blocks NOT touching the forge: 10 pts each', '3 ore blocks = max 30 pts', 'Technicians may open ore blocks by hand at home to reveal fossilized artifact (see M14)'] },
  { id:7,  name:'Heavy Lifting',       pts:30, px:93.0, py:13.5, img:null,
    tips:['Millstone no longer touching its base: 30 pts', 'Size and weight make this a real challenge', 'Practice the pickup motion 20+ times'] },
  { id:8,  name:'Silo',                pts:30, px:92.5, py:42.5, img:null,
    tips:['Preserved pieces outside the silo: 10 pts each', '3 preserved pieces = max 30 pts', 'Empty the silo completely for full points'] },
  { id:9,  name:"What's on Sale?",     pts:30, px:80.5, py:43.5, img:null,
    tips:['Roof completely raised: 20 pts', 'Market wares raised: 10 pts', 'Max 30 pts — raise roof AND wares'] },
  { id:10, name:'Tip the Scales',      pts:30, px:66.5, py:47.5, img:null,
    tips:['Scale tipped and touching the mat: 20 pts', 'Scale pan completely removed: 10 pts', 'Max 30 pts — tip scale AND remove pan'] },
  { id:11, name:'Angler Artifacts',    pts:30, px:57.5, py:86.5, img:null,
    tips:['Artifacts raised above ground layer: 20 pts', 'Bonus +10 if crane flag is at least partly lowered', 'Use the crane to excavate the site'] },
  { id:12, name:'Salvage Operation',   pts:30, px:44.5, py:84.5, img:null,
    tips:['Sand completely cleared: 20 pts (pull activator past the line)', 'Ship completely raised: 10 pts', 'Max 30 pts — clear sand AND raise ship'] },
  { id:13, name:'Statue Rebuild',      pts:30, px:55.0, py:40.0, img:null,
    tips:['Statue completely raised: 30 pts', 'Reconstruct statue to help piece together its historic significance', 'Approach from the front of the statue'] },
  { id:14, name:'Forum',               pts:35, px:43.5, py:47.5, img:null,
    tips:['5 pts each artifact touching mat and at least partly in the forum', 'Items: Brush, Topsoil, Precious Artifact, Opposing Minecart, Ore w/ Fossilized Artifact, Millstone, Scale Pan', 'Max 35 pts (7 items × 5 pts) — deliver as many as possible'] },
];

const MISSION_15 = {
  id: 15, name: 'Site Marking', pts: 30, img: null,
  tips: [
    'Sites with flag at least partly inside & touching mat: 10 pts each',
    'Sites are outlined on the mat wireframe',
    '3 sites = max 30 pts — place all flags'
  ]
};

const FLAG_POSITIONS = [
  { px: 25.5, py: 30.5 },
  { px: 58.0, py: 14.5 },
  { px: 43.0, py: 83.5 },
];
