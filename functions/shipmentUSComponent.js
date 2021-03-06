const IMAGEURL = ["https://cdn.pacificgroup.net/res/6e4ad500-1b00-11eb-a920-8125b1a2392f-smgi-ship-clr-1200px.png",
                  "https://cdn.pacificgroup.net/res/cc1c6c10-8681-11eb-9191-65630f880ca6-gmail-flying-p-white-bg.jpg",
                  "https://cdn9.pacificgroup.net/i/stk/USA-flag-cupcake-150.jpg",
                  "https://cdn9.pacificgroup.net/i/stk/canada-container-150.png",
                  "https://cdn.pacificgroup.net/res/95260e70-7242-11ec-bcdf-3f57d19e6568-pcb-archie-profile-pic-360x360.png",
                  ];
const EMOJIS = ["🤔"];

exports = async function (arg){
  
  const [user, shipmentData] = arg;
  
  console.log('user: ', JSON.stringify(user));
  console.log("shipmentData: ", JSON.stringify(shipmentData));
    
  const component = {}
  const cards = [];
  const firstName = user.name.split(' ')[0];
  
  
  if (shipmentData.length === 0) {
    component.text= "Oh, well..";
    
    cards.push({
      "header": {
      "title": "Archie",
      "subtitle": `PAPS`,
      "imageUrl": IMAGEURL[2],
      "imageStyle": "AVATAR"
      }, 
      "sections": [
        {
          "widgets": [
            {
              "textParagraph": {
                  "text": `<font> Couldn't find anything for "${user.userTyped}", ${firstName}  ${EMOJIS[0]} </font>`
              }
            }
          ]
        }
      ]
   })
    component.cards = cards;
  }
  
  if (shipmentData.length >= 1) {
    const data = shipmentData[0];
    
    component.text =  `${context.functions.execute("getTextMessage", {type:"papsSearch", userFirstName: firstName})}`;
    let cargowiseJobNumber;
    
    try {
      cargowiseJobNumber = await context.functions.execute('getCargowiseJobnumber', data.entityKey);
    } 
    catch(e) {
      console.log("cargowise data error: ", e)
    }
                              
    console.log('cargoJobNumber: ', cargowiseJobNumber)
    
    const cargowiseURL = `https://ws.pacificgroup.net/pcbuscwurl.cfm/edient:Command=ShowEditForm&Domain=wisecloud.zone&Instance=PCUWSG&ControllerID=JobDeclaration&BusinessEntityPK=${cargowiseJobNumber}`;
  
    cards.push({
      "header": {
        "title": "Archie",
        "subtitle": `PAPS`,
        "imageUrl": IMAGEURL[2],
        "imageStyle": "AVATAR"
      },
  
      "sections": [
        {
          "widgets": [
           {
            "textParagraph": {
                "text": `<b>Searched for: </b>  <b><font color=\"#42AD46\">${user.userTyped}</font></b>`
              }
            },
            {
              "textParagraph": {
                  "text": `<b>PAPS/SCN#: </b>  <b><font color=\"#42AD46\">${data.paps}</font></b>`
                }
            },
            {
              "textParagraph": {
                  "text": `<b>Updated Date & Time: </b>  <font color=\"#A6192E\">${new Date(data.releaseData)}</font>`
                }
            },
            {
              "textParagraph": {
                "text": `<b>Client: </b>  <font color=\"#A6192E\">${data.custQuickName}</font>`
                }
            },
            {
              "textParagraph": {
                "text": `<b>Consignees: </b>  <font color=\"#A6192E\">${data.consignees}</font>`
                }
            },
            {
              "textParagraph": {
                  "text": `<b>Port of Entry: </b>  <font color=\"#A6192E\" size=\"20px\">${data.portEntry}</font>`
                }
            },
            {
              "textParagraph": {
                  "text": `<b>Entry #: </b>  <font color=\"#A6192E\" size=\"20px\">${data.entryNum}</font>`
                }
            },
            {
            "textParagraph": {
                "text": `<b>Assigned to: </b>  <b><font color=\"#42AD46\">${data.assignedtoFullname ? data.assignedtoFullname + "(" + data.assigneduser + ")" : "Not Available"}</font></b>`
              }
            },
            {
            "textParagraph": {
                "text": `<b>Submitted by: </b>  <b><font color=\"#42AD46\">${data.submitteduserFullname ? data.submitteduserFullname + "(" + data.submitteduser + ")" : "Not Available"}</font></b>`
              }
            },
            {
              "textParagraph": {
                  "text": `<b>Status: </b>  <b><font color=\"#42AD46\">${data.returnStatus}</font></b>`
                }
            },
            {
              "textParagraph": {
                  "text": `<b>Status Detail: </b>  <font color=\"#A6192E\">${data.returnInfo}</font>`
                }
            },
            {
              "textParagraph": {
                  "text": `<b>Job #: </b>  <b><font color=\"#42AD46\">${data.entityKey}</font></b>`
                }
            },
            {
              "keyValue": {
                  "topLabel": `Take me to`,
                  "content": `<b><font color=\"#1e88e5\">CARGO WISE</font></b>`,
                  "icon": "STAR",
                  "contentMultiline": "false",
                  "onClick": {
                      "openLink": {
                          "url": cargowiseURL
                      }
                  },
              }
          },
            {
              "buttons": [ {
                      "textButton": {
                        "text": "CRM history",
                        "onClick": {
                            "openLink": {
                                  "url": `https://pcbcrm.pacificgroup.net/crm/rewrite.cfm/taskqueue/cargowise/history/${data.entityKey}`
                              }
                        }
                      }
              },
                {
                      "textButton": {
                        "text": "SCN Checker",
                        "onClick": {
                            "openLink": {
                                  "url": `https://www.pcbusa.com/tools/release-status?q=${data.paps}`
                              }
                          }
                        }
                  },
                  {
                      "textButton": {
                        "text": "E-Admin",
                        "onClick": {
                            "openLink": {
                                  "url": `https://eadmin.pcb.ca/otrs/index.pl?Action=AgentTicketZoom&TicketID=${data.eadminticketid}`
                              }
                        }
                      }
                  },
              ]
            },

        ]
      }
    ],
  });
    
  component.cards = cards;
  }
  console.log("end of USComponent")
  return component;
};
