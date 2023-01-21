import './ArtGallery.styles.scss';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import Rectangle106 from '@images/art-gallery/Rectangle106.png';
import Rectangle107 from '@images/art-gallery/Rectangle107.png';
import Rectangle108 from '@images/art-gallery/Rectangle108.png';
import Rectangle109 from '@images/art-gallery/Rectangle109.png';
import Rectangle110 from '@images/art-gallery/Rectangle110.png';
import { getImageSize } from 'react-image-size';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import ArtGalleryListOfItem from './ArtGalleryListOfItem/ArtGalleryListOfItem.component';
import useMobx from '@/app/stores/root-store';
import { useRouteId } from '@/app/common/hooks/stateful/useRouter.hook';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { observe } from 'mobx';
import { observer } from 'mobx-react-lite';

interface StreetcodeArtGallery {
    index: number;
    description?: string;
    imageHref: string;
  }


const ArtGallery = () => {
    const { streetcodeArtStore } = useMobx();
        const { fetchStreetcodeArtsByStreetcodeId, getStreetcodeArtArray } = streetcodeArtStore;
        const [artMap, setArtMap] = useState(new Map<number,[string, number]>());

        const streetcodeId = useRouteId();
     
        useAsync(
          async () => fetchStreetcodeArtsByStreetcodeId(streetcodeId),
            
            // streetcodeArtGalleryData.map((data) =>{ 
                       
            //     getImageSize(data.imageHref)
            //      //.then(({ width, height }) => { width < height ?   console.log('1111111111111111'): console.log('2222211111111112222')})
            //      .then(({ width, height }) => { width < height ?   setArtMap(new Map(artMap.set(data.index,[data.imageHref, 2]))): setArtMap(new Map(artMap.set(data.index,[data.imageHref, 1])));console.log(artMap)})
            //      .catch((errorMessage) => console.log(errorMessage));
             
            //      })
                
            [streetcodeId],
        
        );
        
      
    //const aMap=new Map<number,[string, number]>()
    //const [artMap, setArtMap] = useState(new Map<number,[string, number]>());
    //     streetcodeArtGalleryData.map((data) =>{   
    //     getImageSize(data.imageHref)
    //         .then(({ width, height }) => { width < height ?   setArtMap(new Map(aMap.set(data.index,[data.imageHref, 2]))): setArtMap(new Map(aMap.set(data.index,[data.imageHref, 1])));console.log('artMap.keys')})
    //      // .then(({ width, height }) => { width < height ?   setArtMap(new Map(artMap.set(data.index,[data.imageHref, 2]))): setArtMap(new Map(artMap.set(data.index,[data.imageHref, 1])));console.log('artMap.keys')})
    //         .catch((errorMessage) => console.log(errorMessage));
 
    //  })
    function StreetcodeArtFunc(){
        // const streetcodeArtGalleryData:StreetcodeArtGallery[]=
        return [...getStreetcodeArtArray?.map((a) => ({
              index: a.index,
              description: a.art.description,
              imageHref: a.art.image.url.href
      }))];
    }
          const streetcodeArtGalleryData=StreetcodeArtFunc()
          
        //  useEffect(() => {

            console.log("streetcodeArtGalleryData")
            console.log(streetcodeArtGalleryData)
                   streetcodeArtGalleryData.map((data) =>{ 
                   
                   getImageSize(data.imageHref)
                    //.then(({ width, height }) => { width < height ?   console.log('1111111111111111'): console.log('2222211111111112222')})
                    .then(({ width, height }) => { width < height ?   setArtMap(new Map(artMap.set(data.index,[data.imageHref, 2]))): setArtMap(new Map(artMap.set(data.index,[data.imageHref, 1])));console.log(artMap)})
                    .catch((errorMessage) => console.log(errorMessage));
                
                    })
       // },[]) 
    console.log(artMap)    
   
    
    // const images: string[] =[
    //     Rectangle106,Rectangle107,Rectangle108,Rectangle109,Rectangle110,
    //     Rectangle108,Rectangle108,Rectangle108,
    //     Rectangle106,Rectangle106,Rectangle106,Rectangle106,Rectangle106,Rectangle106,
    //     Rectangle108,Rectangle106,Rectangle107,Rectangle108,
    //     Rectangle106,Rectangle106,Rectangle106,
    //   //  Rectangle107,Rectangle108,
    // ]
    //    const [artMap, setArtMap] = useState(new Map<number,[string, number]>());
    //    useEffect(() => {
    //                images?.map((image,i) =>{   
    //                getImageSize(image)
    //                 .then(({ width, height }) => { width < height ?   setArtMap(new Map(artMap.set(i,[image, 2]))): setArtMap(new Map(artMap.set(i,[image, 1])));console.log(artMap.keys)})
    //                 .catch((errorMessage) => console.log(errorMessage));
                
    //                 })
    //     },[])
     
    const sortNumArt = new Map([...artMap].sort((a, b) => a[0] - b[0]));
    let j=0
    let listArt=[]
    let arr: string[]=[]
    let slideOfArtList=[]
    let obj: StreetcodeArtGallery[]=[];
   // console.log(sortNumArt)
    let jCount=0;
    for (let [key, value] of sortNumArt) {
        if(j!=6){  
            console.log(key + " = " + value[0]+"-"+value[1]); 
            j+=value[1];
            jCount+=value[1];
            arr.push(value[0])
            obj.push({index: key, imageHref:value[0]})
            //console.log(obj)
        }
        if(j==6)
        { 
            j=0;
            console.log("......................")
           // listArt.push(<ArtGalleryListOfItem images={arr}/>)
            slideOfArtList.push(<ArtGalleryListOfItem images={obj.map((i)=>i.imageHref)}/>)
            arr=[] 
            obj=[]         
        }
        
    }
   
    if(!Number.isInteger(jCount/6))
    {
     // listArt.push(<ArtGalleryListOfItem images={arr}/>)
      slideOfArtList.push(<ArtGalleryListOfItem images={obj.map((i)=>i.imageHref)}/>)
    }
    
    return (
        
        <div className="artGalleryWrapper">
              <img src='https://uk.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD_%D1%96_%D0%BC%D0%B0%D0%BB%D1%8E%D0%BD%D0%BA%D1%96%D0%B2_%D0%A2%D0%B0%D1%80%D0%B0%D1%81%D0%B0_%D0%A8%D0%B5%D0%B2%D1%87%D0%B5%D0%BD%D0%BA%D0%B0#/media/%D0%A4%D0%B0%D0%B9%D0%BB:Portret_nevidomoho_Shevchenko_.jpg'/>
            <div className="artGalleryContainer">
                <BlockHeading headingText="Арт-галерея" />
                {/* <div className="artGalleryContentContainer">
                    <div className="artGallerySliderContainer">
                        
                        <SlickSlider
                            infinite={false}
                            swipe={false}
                            dots={true}
                            rows={1}
                            slidesToShow={1}
                           // slides={sliderItems}
                            // slides={[<ArtGalleryListOfItem images={arr}/>,
                            //       //   <ArtGalleryListOfItem images={[Rectangle108,Rectangle107,Rectangle107,Rectangle109,Rectangle109]}/>
                            //         ]}
                            slides={listArt}
                        />    
                    </div>    
                </div>  */}
                <div className="artGalleryContentContainer">
                    <div className="artGallerySliderContainer">
                        
                        <SlickSlider
                            infinite={false}
                            swipe={false}
                            dots={true}
                            rows={1}
                            slidesToShow={1}
                            slides={slideOfArtList}
                        />    
                    </div>    
                </div>         
            </div>    
        </div>
    );
};

export default observer(ArtGallery);