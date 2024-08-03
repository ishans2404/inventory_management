'use client';
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box, Modal, Stack, TextField, Typography, Button, Grid, Card, CardContent, CardActions, CircularProgress, Paper, Drawer, List, ListItem, ListItemText
} from "@mui/material";
import { collection, deleteDoc, getDocs, query, setDoc, getDoc, doc } from "firebase/firestore";
import { useMediaQuery } from '@mui/material';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState("");
  const [loading, setLoading] = useState({ adding: false, removing: false });
  const [searchQuery, setSearchQuery] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isMobile = useMediaQuery('(max-width:600px)');

  const updateInventory = async () => {
    setLoading(prev => ({ ...prev, adding: true, removing: true }));
    const snapshot = query(collection(firestore, "inventory-management"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
    setLoading({ adding: false, removing: false });
  };

  const addItem = async (item) => {
    setLoading(prev => ({ ...prev, adding: true }));
    const docRef = doc(collection(firestore, "inventory-management"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
    setItem("");
    handleClose();
  };

  const removeItem = async (item) => {
    setLoading(prev => ({ ...prev, removing: true }));
    const docRef = doc(collection(firestore, "inventory-management"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) await deleteDoc(docRef);
      else await setDoc(docRef, { quantity: quantity - 1 });
    }
    await updateInventory();
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = inventory.filter(item => item.name.toLowerCase().includes(query));
    setFilteredInventory(filteredList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const toggleDashboard = () => setShowDashboard(prev => !prev);

  const totalItems = inventory.length;
  const totalQuantity = inventory.reduce((acc, item) => acc + item.quantity, 0);
  const averageQuantity = totalItems ? (totalQuantity / totalItems).toFixed(2) : 0;

  const handleSidebarToggle = () => setSidebarOpen(prev => !prev);

  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      flexDirection="row"
      sx={{ backgroundColor: '#EEEEEE' }}
    >
      <Drawer
        anchor={isMobile ? 'top' : 'left'}
        open={sidebarOpen}
        onClose={handleSidebarToggle}
        variant={isMobile ? 'temporary' : 'permanent'}
        sx={{ width: 250, flexShrink: 0, '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box' } }}
      >
        <List>
          <ListItem button onClick={() => { setShowDashboard(false); handleSidebarToggle(); }}>
            <ListItemText primary="Inventory" />
          </ListItem>
          <ListItem button onClick={() => { setShowDashboard(true); handleSidebarToggle(); }}>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </List>
      </Drawer>
      <Box
        flex={1}
        p={3}
        overflow="auto"
      >
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={{ xs: '90%', sm: 400 }}
            bgcolor="white"
            borderRadius="8px"
            boxShadow={3}
            p={3}
            display="flex"
            flexDirection="column"
            gap={2}
            sx={{ transform: "translate(-50%, -50%)" }}
          >
            <Typography variant="h6" sx={{ textAlign: 'center', color: '#201E43' }}>Add New Item</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={item}
              onChange={(e) => setItem(e.target.value)}
              label="Item Name"
              size="small"
            />
            <Button
              variant="contained"
              sx={{ bgcolor: '#134B70', color: '#FFF' }}
              onClick={() => addItem(item)}
              disabled={loading.adding}
            >
              {loading.adding ? <CircularProgress size={24} color="inherit" /> : "Add Item"}
            </Button>
          </Box>
        </Modal>
        {isMobile && (
  <Button
    variant="contained"
    sx={{ bgcolor: '#134B70', color: '#FFF', mb: 2 }}
    onClick={handleSidebarToggle}
  >
    Menu
  </Button>
)}

        <Typography variant="h4" gutterBottom sx={{ color: '#134B70' }}>
          InventoryFlow: Your Inventory, Perfectly in Sync.
        </Typography>
        {showDashboard ? (
          <Box
            borderRadius="8px"
            width="100%"
            maxWidth="800px"
            bgcolor="white"
            boxShadow={3}
            p={2}
          >
            <Typography variant="h5" gutterBottom sx={{ color: '#134B70', textAlign: 'center' }}>
              Inventory Analytics
            </Typography>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">Total Items: {totalItems}</Typography>
              <Typography variant="h6">Total Quantity: {totalQuantity}</Typography>
              <Typography variant="h6">Average Quantity per Item: {averageQuantity}</Typography>
            </Paper>
          </Box>
        ) : (
          <>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search items..."
              value={searchQuery}
              onChange={handleSearch}
              size="small"
              sx={{ mb: 2, maxWidth: '800px' }}
            />
            <>
            <>
            <Box>
            <Button
              variant="contained"
              sx={{ bgcolor: '#134B70', color: '#FFF', mb: 2 }}
              onClick={handleOpen}
              disabled={loading.adding || loading.removing}
            >
              Add New Item
            </Button>
            </Box>
            </>
            </>
            <Box
              borderRadius="8px"
              width="100%"
              maxWidth="800px"
              bgcolor="white"
              boxShadow={3}
              overflow="hidden"
            >
              
              <Box
                width="100%"
                height="auto"
                bgcolor="#134B70"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={2}
              >
                <Typography variant="h5" textAlign="center" color="#FFF">
                  Inventory Items
                </Typography>
              </Box>
              <Grid container spacing={2} p={2}>
                {filteredInventory.map(({ name, quantity }) => (
                  <Grid item xs={12} sm={6} md={4} key={name}>
                    <Card variant="outlined" sx={{ borderRadius: '8px', boxShadow: 2 }}>
                      <CardContent>
                        <Typography variant="h6" component="div" sx={{ color: '#201E43' }}>
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {quantity}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="contained"
                          sx={{ bgcolor: '#134B70', color: '#FFF' }}
                          onClick={() => addItem(name)}
                          size="small"
                          disabled={loading.adding || loading.removing}
                        >
                          {loading.adding ? <CircularProgress size={24} color="inherit" /> : "Add"}
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ bgcolor: '#508C9B', color: '#FFF' }}
                          onClick={() => removeItem(name)}
                          size="small"
                          disabled={loading.adding || loading.removing}
                        >
                          {loading.removing ? <CircularProgress size={24} color="inherit" /> : "Remove"}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
