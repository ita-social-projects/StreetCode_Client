import ArtGalleryItem from "./ArtGalleryItem/ArtGalleryItem.component";

interface Props {
    images:string[]
  
}

  
const ArtGalleryListOfItem = (props: Props) => {
  
  const hh=props
  const images = props.images;
  console.log("===========================image=================================")
  images?.map((image)=>(
    console.log(image)
  ))
  
      return (
        <div className="slideArt"  
        style={{       
            height:"560px",
            width:"1210px",
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
       >
        {images?.map((image)=>(
            <ArtGalleryItem  image={image}/>
        ))}
    
        
    </div>
      );
}
  
  export default ArtGalleryListOfItem;