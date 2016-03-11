#! /usr/bin/python2.6 -OO
# -*- coding: utf-8 -*-
"""
Signup
======

:Copyright: 2014 Reading Makerspace Ltd.
:Licence: GPL v2
:Authors: Barnaby Shearer <b@Zi.iS>
"""
from __future__ import division, absolute_import, print_function, unicode_literals

import cgitb, cgi
cgitb.enable()

import gpgme
from StringIO import StringIO
import smtplib
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart

form = cgi.FieldStorage();
msg = MIMEMultipart()
msg['Subject'] = 'rlab signup'
msg['From'] = 'wiki@rlab.org.uk'
msg['To'] = 'b+tvrrug@zi.is'

msg2 = MIMEMultipart()
msg2['Subject'] = 'rlab signup'
msg2['From'] = 'wiki@rlab.org.uk'
msg2['To'] = 'simonjgreen@me.com'


buf = ""
for name in form.keys():
    if name!='photo' and name!='notphoto':
        if isinstance(form[name], (list, tuple)):
            buf += name + "= " + ", ".join([i.value for i in form[name]]) + "\n\n"
        else:
            buf += name + "= " + form[name].value + "\n\n"
msg.attach(MIMEText(buf, 'plain'))
msg2.attach(MIMEText(buf, 'plain'))

try:
    txt = "@@@\n"
    txt += form['name'].value + "\n"
    txt += form['email'].value + "\n"
    txt += form['address'].value + "\n"
    txt += form['postcode'].value + "\n"
    txt = MIMEText(txt, 'plain')
    txt.add_header('Content-Disposition', 'attachment', filename=form['id'].value[:-4] + '.txt')
    msg.attach(txt)
except:
    pass

try:
    img = MIMEImage(form['photo'].file.read())
    img.add_header('Content-Disposition', 'attachment', filename=form['id'].value[:-4] + '.jpg')
    msg.attach(img)
except:
    pass


ctx = gpgme.Context() 
ctx.armor = True
out_msg = StringIO()
ctx.encrypt([ctx.get_key(msg['To'])], gpgme.ENCRYPT_ALWAYS_TRUST, StringIO(msg), out_msg)
smsg = MIMEMultipart(_subtype='encrypted',protocol='application/pgp-encrypted')
smsg['Subject'] = msg['Subject']
smsg['From'] = msg['From']
smsg['To'] = msg['To']
emsg = MIMEBase('application', 'pgp-encrypted')
smsg.attach(emsg) 
emsg = MIMEBase('application', 'octet-stream', name='encrypted.asc')
out_msg.seek(0)
emsg.set_payload(out_msg.read())
smsg.attach(emsg)

ctx2 = gpgme.Context() 
ctx2.armor = True
out_msg2 = StringIO()
ctx2.encrypt([ctx2.get_key(msg2['To'])], gpgme.ENCRYPT_ALWAYS_TRUST, StringIO(msg2), out_msg2)
smsg2 = MIMEMultipart(_subtype='encrypted',protocol='application/pgp-encrypted')
smsg2['Subject'] = msg2['Subject']
smsg2['From'] = msg2['From']
smsg2['To'] = msg2['To']
emsg2 = MIMEBase('application', 'pgp-encrypted')
smsg2.attach(emsg2) 
emsg2 = MIMEBase('application', 'octet-stream', name='encrypted.asc')
out_msg2.seek(0)
emsg2.set_payload(out_msg2.read())
smsg2.attach(emsg2)

s = smtplib.SMTP('localhost')
s.sendmail(smsg['From'], smsg['To'], smsg.as_string())
s.sendmail(smsg2['From'], smsg2['To'], smsg2.as_string())
s.quit()

print("""Location: https://readinghackspace.org.uk/signup/
""")
