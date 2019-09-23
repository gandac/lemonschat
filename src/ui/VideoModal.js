import React,{Component}  from 'react';
import YouTube from 'react-youtube';
import {MESSAGE_CODE_VIDEO_1,MESSAGE_CODE_VIDEO_2} from '../actions/mainRoom';

export default class VideoModal extends Component{
   
    componentDidMount(){
        console.log('mooouooooooont');
        this.props.inputRef.blur();
    }
    _onReady(event) {
        // access to player in all event handlers via event.target
        event.target.playVideo();
        //event.target.focus();
        this.videoRef.focus();
        // const iframe = event.target;
        // var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
        // if (requestFullScreen) {
        //   requestFullScreen.bind(event.target)();
        // }
      }
      _onEnd(event){
          console.log('event captured in videomodal');
        this.props.onEndVideo(event);
      }

    render(){
        const videosMapedToCode = {
            [MESSAGE_CODE_VIDEO_1] : this.props.videos.video1.id,
            [MESSAGE_CODE_VIDEO_2] : this.props.videos.video2.id,
        }
        const videoId = videosMapedToCode[this.props.code];
        const opts = {
            height: '390',
            width: '390',
            playerVars: { // https://developers.google.com/youtube/player_parameters
              autoplay: 1,
              playsinline: 1,
              related:0,
              rel:0,
              showInfo:0,
            }
          };
        return <div className="videoModal">
                
                <YouTube
                    videoId={videoId}
                    opts={opts}
                    ref={(ref)=>this.videoRef = ref}
                    onReady={(event)=>this._onReady(event)}
                    onEnd={(event)=>this._onEnd(event)}
                />
                {this.props.canClose ? <a className="button--join" onClick={(e) => this.props.onCloseVideo(e)}>Close Video</a> : ''}
            </div>
    }
}