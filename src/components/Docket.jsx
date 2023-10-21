import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx"; // Import the XLSX library for parsing Excel files

const DocketForm = () => {
  const [docketData, setDocketData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    hoursWorked: "",
    ratePerHour: "",
    supplierName: "",
    purchaseOrder: "",
    descriptions: [],
  });
  //   const [selectedDescriptions, setSelectedDescriptions] = useState([]);
  const [originalPurchaseOrders, setOriginalPurchaseOrders] = useState([]);
  const [filteredPurchaseOrders, setFilteredPurchaseOrders] = useState([]);
  //   const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const excelFilePath = "/export29913.xlsx";

    fetch(excelFilePath)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const supplierSet = new Set();
        const range = XLSX.utils.decode_range(worksheet["!ref"]);

        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
          const supplierName =
            worksheet[XLSX.utils.encode_cell({ r: R, c: 11 })].v;
          supplierSet.add(supplierName);
        }

        const uniqueSupplierNames = Array.from(supplierSet);
        setSuppliers(uniqueSupplierNames);

        const allPurchaseOrders = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });
        setOriginalPurchaseOrders(allPurchaseOrders);
        setFilteredPurchaseOrders(allPurchaseOrders);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDocketData({
      ...docketData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Collect the data from the form
    const newData = {
      ...docketData,
      descriptions: docketData.descriptions.join(", "), // Combine descriptions into a single string
    };

    // Add the collected data to the form data
    setFormData([...formData, newData]);

    // Clear the form for the next entry
    setDocketData({
      name: "",
      startTime: "",
      endTime: "",
      hoursWorked: "",
      ratePerHour: "",
      supplierName: "",
      purchaseOrder: "",
      descriptions: [],
    });
  };

  const handleSupplierChange = (e) => {
    const selectedSupplier = e.target.value;

    setDocketData({
      ...docketData,
      supplierName: selectedSupplier,
      purchaseOrder: "", // Clear the selected Purchase Order
      descriptions: [],
    });

    // Filter the Purchase Orders based on the selected supplier
    const filteredPurchaseOrders = originalPurchaseOrders.filter(
      (po) => po[11] === selectedSupplier
    );

    // Update the state with filtered Purchase Orders
    setFilteredPurchaseOrders(filteredPurchaseOrders);
  };

  const handlePurchaseOrderChange = (e) => {
    const selectedPurchaseOrder = e.target.value;

    // Find the selected purchase order in the original list
    const selectedPO = originalPurchaseOrders.find(
      (po) => po[2] === selectedPurchaseOrder
    );

    // Check if the selectedPO exists and get its descriptions (15th column)
    if (selectedPO) {
      const descriptions = originalPurchaseOrders
        .filter((po) => po[2] === selectedPurchaseOrder)
        .map((po) => po[15].split(", "))
        .flat();
      setDocketData({
        ...docketData,
        purchaseOrder: selectedPurchaseOrder,
        descriptions: descriptions,
      });
    } else {
      // If selected purchase order not found, clear the descriptions
      setDocketData({
        ...docketData,
        purchaseOrder: selectedPurchaseOrder,
        descriptions: [],
      });
    }
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Typography variant="h5" component="div" sx={{flexGrow: 1}}>
          DOCKETT FORM
        </Typography>
        <br />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Name"
                type="text"
                name="name"
                value={docketData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                label="Start Time"
                inputProps={{step: 300}}
                name="startTime"
                value={docketData.startTime}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                label="End Time"
                inputProps={{step: 300}}
                name="endTime"
                value={docketData.endTime}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="No. of Hours Worked"
                name="hoursWorked"
                value={docketData.hoursWorked}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Rate per Hour"
                name="ratePerHour"
                value={docketData.ratePerHour}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Purchase Order
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={docketData.purchaseOrder}
                  label="Purchase Order"
                  onChange={handlePurchaseOrderChange}
                >
                  {filteredPurchaseOrders.map((po, index) => (
                    <MenuItem key={index} value={po[1]}>
                      {po[2]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Supplier Name
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="supplierName"
                  label="Supplier Name"
                  value={docketData.supplierName}
                  onChange={handleSupplierChange}
                >
                  {suppliers.map((supplier, index) => (
                    <MenuItem key={index} value={supplier}>
                      {supplier}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Descriptions:</Typography>
              <List>
                {docketData.descriptions.length > 0 ? (
                  docketData.descriptions.map((description, index) => (
                    <ListItem key={index}>{description}</ListItem>
                  ))
                ) : (
                  <ListItem>No descriptions available</ListItem>
                )}
              </List>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" , backgroundColor:'black'}}
          >
            CREATE Docket
          </Button>
        </form>
      </Paper>
      <Paper elevation={3} style={{ marginTop: "20px", padding: "20px" }}>
        <Typography variant="h6" component="div">
          Dockett Data 
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: 'darkgrey', color: 'white' }}>
                <TableCell >Name</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Hours Worked</TableCell>
                <TableCell>Rate per Hour</TableCell>
                <TableCell>Supplier Name</TableCell>
                <TableCell>Purchase Order</TableCell>
                <TableCell>Descriptions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>{data.startTime}</TableCell>
                  <TableCell>{data.endTime}</TableCell>
                  <TableCell>{data.hoursWorked}</TableCell>
                  <TableCell>{data.ratePerHour}</TableCell>
                  <TableCell>{data.supplierName}</TableCell>
                  <TableCell>{data.purchaseOrder}</TableCell>
                  <TableCell>{data.descriptions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default DocketForm;
