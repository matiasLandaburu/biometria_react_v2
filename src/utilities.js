// Triangulations metrics

export const TRIANGULATIONS = [];

//Draw triangle

//Draw the points

export const drawMesh = (predictions, ctx) => {
    if(predictions.length > 0){
        
        predictions.forEach((prediction) => {
            const keyPoints = prediction.scaledMesh;
            for (let i = 0; i < keyPoints.length; i++) {
                const x = keyPoints[i][0];
                const y = keyPoints[i][1];
                ctx.beginPath();
                ctx.arc(x,y,1,0,3*Math.PI);
                ctx.fillStyle = "aqua"
                ctx.fill();
                
            }
        });
    }

}