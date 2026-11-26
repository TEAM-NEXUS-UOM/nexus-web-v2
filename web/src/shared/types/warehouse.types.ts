export interface Warehouse {
  warehouseId: string;       
  warehouseCode: string;   
  warehouseName: string;     
  address: string;          
  contactNumber: string;     
  latitude: number | null;   
  longitude: number | null;  
  isActive: boolean;        
  createdAt: string;         
}