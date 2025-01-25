from flask import Flask, render_template
import cv2
import winsound
import time
import threading

app = Flask(__name__)

# Function to run the OpenCV code
def run_camera():
    webcam = cv2.VideoCapture(0)
    pTime = 0

    while True:
        _, im1 = webcam.read()
        _, im2 = webcam.read()
        diff = cv2.absdiff(im1, im2)
        gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 20, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        for c in contours:
            if cv2.contourArea(c) < 5000:
                continue
            else:
                winsound.Beep(2500, 1000)

        # Frame rate
        cTime = time.time()
        fps = 1 / (cTime - pTime)
        pTime = cTime
        cv2.putText(thresh, str(int(fps)), (20, 50), cv2.FONT_HERSHEY_PLAIN, 3, (255, 0, 0), 3)
        cv2.putText(im1, str(int(fps)), (20, 50), cv2.FONT_HERSHEY_PLAIN, 3, (255, 0, 0), 3)

        cv2.imshow("Security Camera", thresh)
        cv2.imshow("Real Footage", im1)

        # Break the loop if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    webcam.release()
    cv2.destroyAllWindows()

@app.route('/')
def index():
    return render_template('index1.html')

@app.route('/start-camera')
def start_camera():
    # Run the camera in a separate thread to avoid blocking
    threading.Thread(target=run_camera).start()
    return "Camera started! Press 'q' to stop."

if __name__ == '__main__':
    app.run(debug=True)
