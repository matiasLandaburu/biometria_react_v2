// Triangulations metrics

export const TRIANGULATIONS = [];

//Draw triangle

//Draw the points

export const drawMesh = (predictions, ctx) => {
    if(predictions.length > 0){
        
        predictions.forEach((prediction) => {
            const keyPoints = prediction.scaledMesh;
            for (let i = 0; i < keyPoints.length; i++) {
                /*const x = keyPoints[i][0];
                const y = keyPoints[i][1];
                ctx.beginPath();
                ctx.arc(x,y,1,0,3*Math.PI);
                ctx.rect()    
                ctx.fillStyle = "aqua"
                ctx.fill();
                */

                    const start = predictions[i].topLeft;
                    const end = predictions[i].bottomRight;
                    const size = [end[0] - start[0], end[1] - start[1]];
                     ctx.fillRect(start[0], start[1], size[0], size[1]);
            }
        });
    }

}