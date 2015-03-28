#! /bin/bash

# Make sure only root can run our script
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

echo "Copying configuration files... "
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SITE=`readlink -f $DIR/../`
SHARED=`readlink -f $DIR/../../shared`

ln -s $DIR/nginx.conf /etc/nginx/sites-enabled/paint.conf
/etc/init.d/nginx restart
ln -s $DIR/gunicorn.sh /etc/init.d/gunicorn-paint.sh
su deploy -c "ln -s $DIR/post-receive $DIR/../.git/hooks/post-receive"
chown -R deploy.deploy $DIR/../.git/hooks/post-receive
chmod +x $DIR/*.sh $DIR/post-receive

echo "Creating shared folders... "
mkdir $SHARED
mkdir $SHARED/log $SHARED/pid $SHARED/sockets
chown -R deploy.deploy $SHARED

echo "Creating virtual environment... (this may take a minute or two)"
cd $SITE
virtualenv env>/dev/null
source env/bin/activate
pip install -r $DIR/requirements.txt>/dev/null
chown -R deploy.deploy $SITE

echo -e "Done! \n\n"

echo "FINAL TODO:"
echo "+ Create the appropriate database, most likely in:"
echo "   main/settings/20-database.django-settings or"
echo "   main/settings/`hostname`.py"
echo "+ Run ./manage.py syncdb and ./manage.py migrate or load a database file."
echo "+ On your machine create a git remote:"
echo "   git remote add [staging|live|temp] deploy@[hostname]:${SITE} "
echo "+ Set bare=true in .git/config when you are ready to start pushing."
