
import React,{useState,useEffect} from 'react'
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';


import useTable from "./useTable"

export default function NutritionTable() {
  
  const [records, setRecords] = useState([])
  const [headCells, setHeadCells] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // setTimeout(()=>{
      function createData(name, calories, fat, carbs, protein,energy,id) {
        return { name, calories, fat, carbs, protein,energy,id };
      }
      const headItems=[
        { id: 'name', numeric: false, disablePadding: false, label: 'Dessert (100g serving)' },
        { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
        { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
        { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
        { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
        { id: 'energy', numeric: true, disablePadding: false, label: 'Energy (g)' }
      ];
      const items=[
        createData('Cupcake', 305, 3.7, 67, 4.3,100,1),
        createData('Donut', 452, 25.0, 51, 4.9,50,2),
        createData('Eclair', 262, 16.0, 24, 6.0,80,3),
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0,100,4),
        createData('Gingerbread', 356, 16.0, 49, 3.9,40,5),
        createData('Honeycomb', 408, 3.2, 87, 6.5,50,6),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3,40,7),
        createData('Jelly Bean', 375, 0.0, 94, 0.0,20,8),
        createData('KitKat', 518, 26.0, 65, 7.0,20,9),
        createData('Lollipop', 392, 0.2, 98, 0.0,15,10),
        createData('Marshmallow', 318, 0, 81, 2.0,22,11),
        createData('Nougat', 360, 19.0, 9, 37.0,33,12),
        
      ];
      const hCells =headItems
      const allItems =items
      
      setRecords(allItems)
      setHeadCells(hCells)
      setLoading(false)
    // },1000)
    
  },[])



  const{TblContainer,TblHeader,Pagination,rowsAfterPaginationAndSorting,selected,handleClick,AppToolbar}=useTable(records,setRecords,headCells)

  const isSelected = (id) => selected.indexOf(id) !== -1 ;

  if(loading) return <h1>Loading...</h1>

  return (
    <Paper>
      <AppToolbar name="Nutrition List"/>
      <TblContainer>
        <TblHeader/>
        <TableBody>
           {
             rowsAfterPaginationAndSorting().map(({name,calories,fat,carbs,protein,energy,id},index)=>{

              const isItemSelected = isSelected(id);
              const labelId = `enhanced-table-checkbox-${index}`;
            
              return(
              <TableRow 
                key={index}
                hover
                onClick={(event) => handleClick(event, id)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={name}
                selected={isItemSelected}
              >
                  <TableCell padding="checkbox" align="left">
                    <Checkbox
                      checked={isItemSelected}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </TableCell>
                  <TableCell align="left">{name}</TableCell>
                  <TableCell align="right">{calories}</TableCell>
                  <TableCell align="right">{fat}</TableCell>
                  <TableCell align="right">{carbs}</TableCell>
                  <TableCell align="right">{protein}</TableCell>
                  <TableCell align="right">{energy}</TableCell>
              </TableRow>
              )
              })
           }
        </TableBody>
      </TblContainer>
      <Pagination/>
      </Paper>
      
  )
}


