import { useRef, useState, useEffect } from "react";
import { useDocument } from "../../contexts/CustomizeContext";
import { HorizontalToolBar } from "./HorizontalToolbar";
import { VerticalToolbar } from "./VerticalToolbar";
import { TextElement } from "./TextElement";
import { ImageElement } from "./ImageElement";
import { Header } from "../Header"
import { Loading } from "../Loading";

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

function Customize({fullScreen, setFullScreen}) {
    const {textBoxes,images,addTextBox,updateTextBox,deleteTextBox,addImage,updateImage,deleteImage} = useDocument()

    const wrapperRef = useRef(null);
    const exerciseRef = useRef(null)
    const answerRef = useRef(null)
    const [selectedId, setSelectedId] = useState(null);
    const [textSelectedId, setTextSelectedId] = useState(null);
    const [imageSelectedId, setImageSelectedId] = useState(null);
    const [scale, setScale] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [exercisePage, setExercisePage] = useState(1)

    const ZOOM_STEP = 0.1;
    const MIN_ZOOM = 0.3;
    const MAX_ZOOM = 1.5;

    const zoomIn = () => setScale(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
    const zoomOut = () => setScale(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));

    useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId && !textSelectedId) {
        // Verifica se l'id selezionato è una textbox o un'immagine
        const isText = textBoxes.some(el => el.id === selectedId);
        const isImage = images.some(img => img.id === selectedId);

        if (isText) deleteTextBox(selectedId);
        else if (isImage) {

            deleteImage(selectedId);
        }

        setSelectedId(null);
        setTextSelectedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, deleteTextBox, deleteImage, textBoxes, images]);

    useEffect(() => {
        function handleResize() {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const availableWidth = wrapper.clientWidth;
        const newScale = Math.min(availableWidth / PAGE_WIDTH, 1);
        setScale(newScale);

        // Calcola offset orizzontale per centrare la pagina scalata
        const scaledWidth = PAGE_WIDTH * newScale;
        const horizontalOffset = (availableWidth - scaledWidth) / 2;
        setOffsetX(Math.max(horizontalOffset, 0)); // Evita valori negativi
        }

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(()=>{
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const availableWidth = wrapper.clientWidth;
        const scaledWidth = PAGE_WIDTH * scale;
        const offset = (availableWidth - scaledWidth) / 2;
        setOffsetX(Math.max(offset, 0));
    },[scale])

    const handlePageSwitch = () => {
        if (exercisePage === 1){
            answerRef.current.scrollIntoView({ behavior: "smooth" });
        }
        else{
            exerciseRef.current.scrollIntoView({ behavior: "smooth" });
        }
        setExercisePage(prev => prev === 1? 2 : 1)
    }

    return (
        <div className="flex flex-col w-full h-[140%] items-center">
        {!fullScreen && <Header stepnumber={1}></Header>}
            <div className={`flex flex-col w-full ${fullScreen?"h-full":"h-[85%]"} items-center mb-3 ${loading || exporting? "pointer-events-none":""}`}>
                <div className="sticky top-0 z-10 flex w-[90%] justify-start py-2 items-center">
                <HorizontalToolBar 
                zoomIn={zoomIn} zoomOut={zoomOut} 
                scale={scale} 
                fullScreen={fullScreen} setFullScreen={setFullScreen} 
                setSelectedId={setSelectedId} 
                setTextSelectedId={setTextSelectedId} 
                setImageSelectedId={setImageSelectedId} 
                setExporting={setExporting}
                exercisePage={exercisePage}
                handlePageSwitch={handlePageSwitch}></HorizontalToolBar>
                </div>
                <div className="flex flex-row w-full h-full justify-center">
                    <div
                    ref={wrapperRef}
                    className="relative w-[85%] h-full overflow-auto bg-gray-100 pt-3" 
                    >
                        {/* Contenuto centrato con offset dinamico */}
                        {(loading || exporting) && <Loading></Loading>}
                        <div
                            className="absolute origin-top-left"
                            style={{
                            width: PAGE_WIDTH,
                            height: PAGE_HEIGHT,
                            transform: `translateX(${offsetX}px) scale(${scale})`,
                            
                            }}
                        >
                            {/** Exercise Page */}
                            <div ref={exerciseRef} id="document" className={`relative w-full h-full bg-white border-1 ${exercisePage === 1 && !loading?"border-gray-800":"border-gray-300"} drop-shadow-md pb-24`}
                            onClick={()=>setExercisePage(1)}
                            style={{
                                cursor: exercisePage === 1? "default": "pointer",
                            }}>
                                {loading && <div className="absolute inset-0 z-[1000] bg-gray-800/50"></div>}
                                {
                                textBoxes.map((el) => (  
                                    el.page===1 ? <TextElement key={el.id} el={el} selectedId={selectedId} setSelectedId={setSelectedId} textSelectedId={textSelectedId} setTextSelectedId={setTextSelectedId}></TextElement>
                                    : null
                                    
                                ))}
                                {
                                images.map((el)=>(
                                    el.page===1 ? <ImageElement key={el.id} el={el} selectedId={selectedId} setSelectedId={setSelectedId} imageSelectedId={imageSelectedId} setImageSelectedId={setImageSelectedId}></ImageElement>
                                    : null
                                    ))
                                }
                            </div>
                            
                            {/** Answer Page */}
                            <div ref={answerRef} id="answer" className={`relative h-full bg-white border-1 ${exercisePage === 2 && !loading?"border-gray-800":"border-gray-300"} drop-shadow-md pb-24 mt-3`}
                            onClick={()=>setExercisePage(2)}
                            style={{
                                cursor: exercisePage === 2? "default": "pointer",
                            }}>
                                {loading && <div className="absolute inset-0 z-[1000] bg-gray-800/50"></div>}
                                {
                                textBoxes.map((el) => (  
                                    el.page===2 ? <TextElement key={el.id} el={el} selectedId={selectedId} setSelectedId={setSelectedId} textSelectedId={textSelectedId} setTextSelectedId={setTextSelectedId}></TextElement>
                                    : null
                                    
                                ))}
                                {
                                images.map((el)=>(
                                    el.page===2 ? <ImageElement key={el.id} el={el} selectedId={selectedId} setSelectedId={setSelectedId} imageSelectedId={imageSelectedId} setImageSelectedId={setImageSelectedId}></ImageElement>
                                    : null
                                    ))
                                }
                            </div>
                        </div>
                        
                    </div>
                    
                    <VerticalToolbar exercisePage={exercisePage} selectedId={selectedId} setSelectedId={setSelectedId} textSelectedId={textSelectedId} setTextSelectedId={setTextSelectedId} imageSelectedId={imageSelectedId} setImageSelectedId={setImageSelectedId} setLoading={setLoading}></VerticalToolbar>
                    
                </div>
            </div>
        </div>
    );
}

export {Customize}